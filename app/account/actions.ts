'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL, isSupabaseConfigured } from '@/lib/supabase/config';
import { notifyAdmins } from '@/lib/notify';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { normalizeAgentName } from '@/lib/agents';
import { ACCOUNT_COPY, accountPaths, safeNext } from '@/lib/accountCopy';
import { searchAgentNames, type NameCandidate } from '@/lib/agentNameSearch';
import type { Lang } from '@/lib/translations';

export interface ActionState {
  error?: string;
  notice?: string;
}

/** Every action reads the language from a hidden field the form renders, so the
 *  Vietnamese pages get Vietnamese errors without a second copy of each action. */
function langOf(form: FormData): Lang {
  return form.get('lang') === 'vi' ? 'vi' : 'en';
}

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
  const lang = langOf(form);
  const t = ACCOUNT_COPY[lang];
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const email       = str(form, 'email').toLowerCase();
  const password    = str(form, 'password');
  const displayName = str(form, 'display_name');

  if (!displayName || displayName.length < 2) return { error: t.errors.nameRequired };
  if (displayName.length > 80) return { error: t.errors.nameTooLong };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: t.errors.emailInvalid };
  if (password.length < 8) return { error: t.errors.passwordShort };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the handle_new_user() trigger to name the profile and mint its slug.
      data: { display_name: displayName },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=${accountPaths[lang].profile}`,
    },
  });

  // Supabase's own message is English-only, so it is logged rather than shown —
  // a Vietnamese agent should not hit a wall of English at the last step.
  if (error) {
    console.error('[account] signup failed:', error.message);
    return { error: t.errors.signupFailed };
  }

  // Moderation is post-hoc, so this ping is the review trigger. after() runs it
  // once the response is out — a slow webhook must not make signup feel broken.
  after(async () => {
    await notifyAdmins({ type: 'agent_signup', display_name: displayName, email });
  });

  // Supabase returns success for an already-registered address too (it will not
  // confirm or deny that an account exists — that is deliberate, and we keep the
  // same wording rather than leaking which emails are registered).
  return { notice: t.checkInbox };
}

// ─── Sign in ──────────────────────────────────────────────────────────────────
export async function signInAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const lang = langOf(form);
  const t = ACCOUNT_COPY[lang];
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const email    = str(form, 'email').toLowerCase();
  const password = str(form, 'password');

  if (!email || !password) return { error: t.errors.credentialsRequired };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase distinguishes an unconfirmed address; everything else stays a
    // generic message so this form cannot be used to enumerate accounts.
    return {
      error: /confirm/i.test(error.message) ? t.errors.unconfirmed : t.errors.credentialsWrong,
    };
  }

  // Return the agent to whatever sent them here — the "Add property" button in
  // the header points at the listing form, and bouncing them to their profile
  // instead loses the thing they were trying to do.
  redirect(safeNext(str(form, 'next') || undefined, accountPaths[lang].profile));
}

// ─── Sign out ─────────────────────────────────────────────────────────────────
export async function signOutAction(form: FormData) {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect(langOf(form) === 'vi' ? '/vi' : '/');
}

// ─── Password reset ───────────────────────────────────────────────────────────
export async function resetPasswordAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const lang = langOf(form);
  const t = ACCOUNT_COPY[lang];
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const email = str(form, 'email').toLowerCase();
  if (!email) return { error: t.errors.emailRequired };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=${accountPaths[lang].password}`,
  });

  // Always the same response, whether or not the address exists.
  return { notice: t.resetSent };
}

export async function setPasswordAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const lang = langOf(form);
  const t = ACCOUNT_COPY[lang];
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const password = str(form, 'password');
  if (password.length < 8) return { error: t.errors.passwordShort };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: t.errors.resetExpired };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.error('[account] password update failed:', error.message);
    return { error: t.errors.saveFailed };
  }

  redirect(accountPaths[lang].profile);
}

// ─── Update profile ───────────────────────────────────────────────────────────
export async function updateProfileAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const lang = langOf(form);
  const t = ACCOUNT_COPY[lang];
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(accountPaths[lang].login);

  const displayName = str(form, 'display_name');
  const bio         = str(form, 'bio');
  const workplace   = str(form, 'workplace') || 'Independent';
  const phone       = str(form, 'phone');
  const listingName = str(form, 'listing_agent_name');

  if (!displayName || displayName.length < 2) return { error: t.errors.nameRequired };
  if (displayName.length > 80) return { error: t.errors.nameTooLong };
  if (bio.length > 2000)       return { error: t.errors.bioTooLong };
  if (workplace.length > 120)  return { error: t.errors.workplaceTooLong };

  // Photo is optional on every save — only replace it when a new file arrives.
  let photoUrl: string | undefined;
  const file = form.get('photo');
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return { error: t.errors.photoType };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: t.errors.photoSize };
    }

    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    // Fixed path per user (storage RLS pins the folder to the uid), so a re-upload
    // replaces the old file instead of accumulating orphans.
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('agent-photos')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      console.error('[account] avatar upload failed:', uploadError.message);
      return { error: t.errors.photoUpload };
    }

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

  if (error) {
    console.error('[account] profile save failed:', error.message);
    return { error: t.errors.saveFailed };
  }

  revalidatePath('/account/profile');
  revalidatePath('/vi/tai-khoan/ho-so');
  revalidatePath('/agents');
  revalidatePath('/vi/moi-gioi');
  if (before?.slug) {
    revalidatePath(`/agent/${before.slug}`);
    revalidatePath(`/vi/moi-gioi/${before.slug}`);
  }

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

  // Saying "Profile saved" after a claim hides the thing the agent most wants to
  // know: that a human now has to look at it, and roughly when.
  return { notice: claimChanged ? t.claimSubmitted : t.notices.profileSaved };
}

// ─── Claim helper ─────────────────────────────────────────────────────────────

/** Looks up which names an agent's listings are posted under, so the claim step
 *  can show them their own properties before they commit to a name.
 *
 *  Signed-in agents only. The data is public either way (it is on the listing
 *  pages), but there is no reason to expose a name-enumeration endpoint to
 *  anonymous traffic. */
export async function searchClaimNamesAction(query: string): Promise<NameCandidate[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  return searchAgentNames(query);
}
