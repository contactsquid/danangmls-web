'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL, isSupabaseConfigured } from '@/lib/supabase/config';
import { notifyAdmins } from '@/lib/notify';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { normalizeAgentName } from '@/lib/agents';

export interface ActionState {
  error?: string;
  notice?: string;
}

const NOT_CONFIGURED: ActionState = {
  error: 'Agent accounts are not enabled on this site yet. Please try again later.',
};

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

// ─── Sign up ──────────────────────────────────────────────────────────────────
export async function signUpAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const email       = str(form, 'email').toLowerCase();
  const password    = str(form, 'password');
  const displayName = str(form, 'display_name');

  if (!displayName || displayName.length < 2) {
    return { error: 'Please enter your full name.' };
  }
  if (displayName.length > 80) {
    return { error: 'That name is too long (80 characters max).' };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the handle_new_user() trigger to name the profile and mint its slug.
      data: { display_name: displayName },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=/account/profile`,
    },
  });

  if (error) return { error: error.message };

  // Moderation is post-hoc, so this ping is the review trigger. after() runs it
  // once the response is out — a slow webhook must not make signup feel broken.
  after(async () => {
    await notifyAdmins({ type: 'agent_signup', display_name: displayName, email });
  });

  // Supabase returns success for an already-registered address too (it will not
  // confirm or deny that an account exists — that is deliberate, and we keep the
  // same wording rather than leaking which emails are registered).
  return {
    notice:
      'Check your email to confirm your address. The link will bring you back here to finish your profile.',
  };
}

// ─── Sign in ──────────────────────────────────────────────────────────────────
export async function signInAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const email    = str(form, 'email').toLowerCase();
  const password = str(form, 'password');

  if (!email || !password) return { error: 'Enter your email and password.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase distinguishes an unconfirmed address; everything else stays a
    // generic message so this form cannot be used to enumerate accounts.
    return {
      error: /confirm/i.test(error.message)
        ? 'Please confirm your email address first — check your inbox for the link.'
        : 'Incorrect email or password.',
    };
  }

  redirect('/account/profile');
}

// ─── Sign out ─────────────────────────────────────────────────────────────────
export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect('/');
}

// ─── Password reset ───────────────────────────────────────────────────────────
export async function resetPasswordAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const email = str(form, 'email').toLowerCase();
  if (!email) return { error: 'Enter your email address.' };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/account/password`,
  });

  // Always the same response, whether or not the address exists.
  return { notice: 'If that address has an account, a reset link is on its way.' };
}

export async function setPasswordAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const password = str(form, 'password');
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Your reset link has expired. Request a new one.' };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  redirect('/account/profile');
}

// ─── Update profile ───────────────────────────────────────────────────────────
export async function updateProfileAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/account/login');

  const displayName = str(form, 'display_name');
  const bio         = str(form, 'bio');
  const workplace   = str(form, 'workplace') || 'Independent';
  const phone       = str(form, 'phone');
  const listingName = str(form, 'listing_agent_name');

  if (!displayName || displayName.length < 2) return { error: 'Please enter your full name.' };
  if (displayName.length > 80) return { error: 'That name is too long (80 characters max).' };
  if (bio.length > 2000)       return { error: 'Your bio is too long (2,000 characters max).' };
  if (workplace.length > 120)  return { error: 'That workplace name is too long.' };

  // Photo is optional on every save — only replace it when a new file arrives.
  let photoUrl: string | undefined;
  const file = form.get('photo');
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return { error: 'Profile photo must be a JPEG, PNG, or WebP image.' };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: 'Profile photo must be under 5 MB.' };
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    // Fixed path per user (storage RLS pins the folder to the uid), so a re-upload
    // replaces the old file instead of accumulating orphans.
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('agent-photos')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) return { error: `Could not upload photo: ${uploadError.message}` };

    const { data: pub } = supabase.storage.from('agent-photos').getPublicUrl(path);
    // Cache-bust so a replaced avatar shows up immediately behind the CDN.
    photoUrl = `${pub.publicUrl}?v=${Date.now()}`;
  }

  // Read the current claim first, so we can tell a *new* claim (which needs a
  // human to look at it) from an unrelated bio edit.
  const { data: before } = await supabase
    .from('agent_profiles')
    .select('slug, listing_agent_name')
    .eq('id', user.id)
    .maybeSingle();

  const { error } = await supabase
    .from('agent_profiles')
    .update({
      display_name: displayName,
      bio,
      workplace,
      phone: phone || null,
      // Claiming a name only records the claim. It has no public effect until an
      // admin verifies it — the RLS policy blocks self-verification and the
      // agent_public view nulls out unverified claims.
      listing_agent_name: listingName || null,
      ...(photoUrl ? { photo_url: photoUrl } : {}),
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/account/profile');
  revalidatePath('/agents');
  if (before?.slug) revalidatePath(`/agent/${before.slug}`);

  // A newly claimed listing name is the one edit that needs a human decision,
  // so it gets its own ping — with the number of listings it would attach,
  // which is what makes an implausible claim obvious at a glance.
  const claimChanged =
    listingName && normalizeAgentName(listingName) !== normalizeAgentName(before?.listing_agent_name);

  if (claimChanged) {
    after(async () => {
      const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
      const target = normalizeAgentName(listingName);
      const matching = [...rentals, ...forSale]
        .filter(l => normalizeAgentName(l.agent) === target).length;

      await notifyAdmins({
        type: 'listing_claim',
        display_name: displayName,
        profile_url: `${SITE_URL}/agent/${before?.slug ?? ''}`,
        claimed_name: listingName,
        matching_listings: matching,
      });
    });
  }

  return { notice: 'Profile saved.' };
}
