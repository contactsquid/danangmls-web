'use server';

import { forLang } from '@/lib/translations';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAdminClient, createPublicClient } from '@/lib/supabase/server';
import { after } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL, isSupabaseConfigured } from '@/lib/supabase/config';
import { notifyAdmins } from '@/lib/notify';
import { getListings, getForSaleListings } from '@/lib/sheets';
import { normalizeAgentName } from '@/lib/agents';
import { claimPhoneEvidence, describePhoneEvidence } from '@/lib/claimPhoneMatch';
import { ACCOUNT_COPY, AGENT_NAME_COPY, accountPaths, safeNext } from '@/lib/accountCopy';
import { searchAgentNames, listingsForNameKey, type NameCandidate } from '@/lib/agentNameSearch';
import { agentNameKey } from '@/lib/agentNameKey';
import { shouldAutoApproveClaim } from '@/lib/agentOwnership';
import { listingHref } from '@/lib/facets';
import type { Lang } from '@/lib/translations';
import { normalizeVnPhone } from '@/lib/agentContact';

export interface ClaimPrompt {
  /** The name as written on the listings (most common spelling). */
  name: string;
  count: number;
  samples: { title: string; url: string }[];
}

export interface ActionState {
  error?: string;
  notice?: string;
  /** Signup paused: scraped listings exist under this name. The form asks
   *  "Are these yours?" and resubmits with claim_choice=yes|no. */
  claimPrompt?: ClaimPrompt;
}

/** Every action reads the language from a hidden field the form renders, so the
 *  Vietnamese pages get Vietnamese errors without a second copy of each action. */
function langOf(form: FormData): Lang {
  return form.get('lang') === 'vi' ? 'vi' : 'en';
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** All four languages, for the copy that has all four (AGENT_NAME_COPY). */
function fullLangOf(form: FormData): Lang {
  const l = form.get('lang');
  return l === 'vi' || l === 'ko' || l === 'ru' ? l : 'en';
}

/** Postgres unique_violation: the agent_profiles name-key index (0008). */
const UNIQUE_VIOLATION = '23505';

/**
 * Whether another profile already has this name, by agentNameKey (the same key as
 * the unique index in 0008_unique_agent_names.sql). Reads ALL profiles with the
 * service role so a suspended profile, which the public view hides but the index
 * still counts, is caught here too; falls back to the public view without the key.
 * Fails open on a read error: the database index is the backstop.
 */
async function nameTaken(displayName: string, exceptSlug?: string | null): Promise<boolean> {
  const key = agentNameKey(displayName);
  if (!key) return false;
  const admin = createAdminClient();
  const { data, error } = admin
    ? await admin.from('agent_profiles').select('slug, display_name')
    : await createPublicClient().from('agent_public').select('slug, display_name');
  if (error) {
    console.error('[account] name check failed:', error.message);
    return false;
  }
  return (data ?? []).some(p => p.slug !== exceptSlug && agentNameKey(p.display_name) === key);
}

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
  const t = forLang(ACCOUNT_COPY, lang);
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const email       = str(form, 'email').toLowerCase();
  const password    = str(form, 'password');
  const displayName = str(form, 'display_name');
  const phoneRaw    = str(form, 'phone');

  if (!displayName || displayName.length < 2) return { error: t.errors.nameRequired };
  if (displayName.length > 80) return { error: t.errors.nameTooLong };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: t.errors.emailInvalid };
  if (password.length < 8) return { error: t.errors.passwordShort };

  // Required, and enforced HERE rather than by the form's `required` attribute —
  // a server action is a public endpoint and the attribute is trivially skipped.
  // Agents were signing up with no number at all (three of nine before
  // 2026-09-24), which left a live listing nobody could respond to.
  // normalizeVnPhone rejects landlines and malformed input rather than guessing,
  // because a number that cannot take Zalo or SMS is no better than none.
  const phone = normalizeVnPhone(phoneRaw);
  if (!phone) return { error: t.errors.phoneRequired };

  // Consent is a legal requirement (Nghị định 13/2023/NĐ-CP), so it is enforced here, not just by the
  // checkbox's `required`. The time and policy version go into the auth user's metadata as the record.
  if (form.get('consent') !== 'on') return { error: t.errors.consentRequired };

  // ─ Unique names (Blake, 2026-11-25): two profiles that read as the same name
  // leave no way to know which one a lead belongs to.
  const nameT = forLang(AGENT_NAME_COPY, fullLangOf(form));
  if (await nameTaken(displayName)) return { error: nameT.nameTaken(displayName) };

  // ─ "We found N listings posted as X. Are these yours?" Exact name-key match on
  // scraped listings. Revealing that a public name has listings is fine (they are
  // on the site); whether an EMAIL exists is still never revealed.
  const claimChoice = str(form, 'claim_choice');
  if (claimChoice === 'no') return { error: nameT.nameIsSomeoneElse };
  const group = await listingsForNameKey(displayName);
  if (group && claimChoice !== 'yes') {
    return {
      claimPrompt: {
        name: group.name,
        count: group.listings.length,
        samples: group.listings.slice(0, 3).map(l => ({ title: (lang === 'vi' && l.vi_title) || l.title, url: listingHref(l.slug, lang) })),
      },
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Read by the handle_new_user() trigger to name the profile and mint its slug.
      // Canonical 0 + 9 digits. The trigger copies both into the new profile.
      data: { display_name: displayName, phone: `0${phone}`, privacy_consent_at: new Date().toISOString(), privacy_policy_version: '2026-10-20' },
      emailRedirectTo: `${SITE_URL}/auth/callback?next=${forLang(accountPaths, lang).profile}`,
    },
  });

  // Supabase's own message is English-only, so it is logged rather than shown —
  // a Vietnamese agent should not hit a wall of English at the last step.
  if (error) {
    console.error('[account] signup failed:', error.message);
    // The unique name index fires inside handle_new_user(), which surfaces as a
    // generic "Database error saving new user": a race with another signup under
    // the same name. Re-check so the agent gets the actionable message.
    if (await nameTaken(displayName)) return { error: nameT.nameTaken(displayName) };
    return { error: t.errors.signupFailed };
  }

  // "Yes, these are mine": record the claim on the new profile with the spelling
  // used on the listings, and approve it outright when the signup phone is on every
  // phone-bearing listing under that name (lib/agentOwnership.ts). Otherwise it
  // waits for an admin, as a claim from the profile page does. Service role,
  // because the guard trigger stops a user from setting the verified flag.
  // For an already-registered email Supabase returns a placeholder user whose id
  // matches no profile, so this updates nothing and reveals nothing.
  let claimStatus: 'auto-approved' | 'pending' | undefined;
  const userId = data.user?.id;
  if (group && claimChoice === 'yes' && userId) {
    const admin = createAdminClient();
    const auto = shouldAutoApproveClaim(group.name, phone, group.listings);
    if (admin) {
      const { error: claimError } = await admin
        .from('agent_profiles')
        .update({ listing_agent_name: group.name, listing_agent_name_verified: auto })
        .eq('id', userId);
      if (claimError) console.error('[account] signup claim failed:', claimError.message);
      else claimStatus = auto ? 'auto-approved' : 'pending';
    } else {
      console.error('[account] signup claim skipped: no service role key');
    }
  }

  // Moderation is post-hoc, so this ping is the review trigger. after() runs it
  // once the response is out — a slow webhook must not make signup feel broken.
  after(async () => {
    await notifyAdmins({
      type: 'agent_signup',
      display_name: displayName,
      email,
      ...(claimStatus && group
        ? { claimed_name: group.name, matching_listings: group.listings.length, claim_status: claimStatus }
        : {}),
    });
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
  const t = forLang(ACCOUNT_COPY, lang);
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
  redirect(safeNext(str(form, 'next') || undefined, forLang(accountPaths, lang).profile));
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
  const t = forLang(ACCOUNT_COPY, lang);
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const email = str(form, 'email').toLowerCase();
  if (!email) return { error: t.errors.emailRequired };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=${forLang(accountPaths, lang).password}`,
  });

  // Always the same response, whether or not the address exists.
  return { notice: t.resetSent };
}

export async function setPasswordAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const lang = langOf(form);
  const t = forLang(ACCOUNT_COPY, lang);
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

  redirect(forLang(accountPaths, lang).profile);
}

// ─── Update profile ───────────────────────────────────────────────────────────
/**
 * Deletes the signed-in agent's own account.
 *
 * Blake asked for this because the onboarding emails repeat, and someone who has
 * left the industry needs a way out that is not "ask us". Unsubscribing stops the
 * email; this removes the account itself. Nghị định 13/2023/NĐ-CP also expects
 * personal data to be erasable on request.
 *
 * There are NO foreign keys between auth.users and these tables (checked
 * 2026-09-19), so nothing cascades — every row has to be named explicitly or it
 * is left orphaned.
 *
 * What this deliberately does NOT do: remove the agent's listings from the Google
 * Sheet. Those rows are shared pipeline data, a bulk sheet delete is the operation
 * that has destroyed real rows here before, and it needs a backup and an explicit
 * go-ahead. Losing the profile simply unlinks them — getAgentSlugForName returns
 * null and the agent's name renders as plain text, which is what happens for the
 * thousands of scraped agents who never signed up.
 */
export async function deleteAccountAction(
  _prev: { error?: string } | undefined,
  form: FormData,
): Promise<{ error?: string }> {
  const lang = langOf(form);
  const t = forLang(ACCOUNT_COPY, lang);

  const supabase = await createClient();
  if (!supabase) return { error: t.errors.saveFailed };

  // getUser(), never getSession(): a session cookie is client-supplied and can be
  // forged. This is an irreversible action, so it must be authorised against the
  // auth server.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(forLang(accountPaths, lang).login);

  // Typed confirmation. A single click is too cheap for something unrecoverable,
  // and the word is localised so it cannot be muscle-memory from another site.
  const confirmation = str(form, 'confirm').trim().toUpperCase();
  if (confirmation !== t.deleteConfirmWord.toUpperCase()) {
    return { error: t.errors.deleteConfirm };
  }

  const admin = createAdminClient();
  if (!admin) return { error: t.errors.saveFailed };

  // Order matters: profile rows first, auth user last. If this fails halfway the
  // account still exists and the agent can retry; deleting the auth user first
  // would strand rows with no way to reach them.
  await admin.from('agent_email_drip').delete().eq('user_id', user.id);
  const { error: profileError } = await admin.from('agent_profiles').delete().eq('id', user.id);
  if (profileError) return { error: t.errors.saveFailed };

  const { error: authError } = await admin.auth.admin.deleteUser(user.id);
  if (authError) return { error: t.errors.saveFailed };

  await supabase.auth.signOut();
  revalidatePath('/agents');
  revalidatePath('/vi/moi-gioi');
  redirect(lang === 'vi' ? '/vi?deleted=1' : '/?deleted=1');
}

export async function updateProfileAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  const lang = langOf(form);
  const t = forLang(ACCOUNT_COPY, lang);
  if (!isSupabaseConfigured) return { error: t.errors.notConfigured };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(forLang(accountPaths, lang).login);

  const displayName = str(form, 'display_name');
  const bio         = str(form, 'bio');
  const workplace   = str(form, 'workplace') || 'Independent';
  const phone       = str(form, 'phone');
  // Zalo + Message ride on the number itself, so only WhatsApp is a choice.
  // Guarded on a saved number so nobody can publish a button with nothing behind it.
  // (has_zalo stays in the table, unwritten, in case an opt-OUT is ever wanted.)
  const hasWhatsapp = form.get('has_whatsapp') === 'on' && phone.trim() !== '';
  const listingName = str(form, 'listing_agent_name');

  if (!displayName || displayName.length < 2) return { error: t.errors.nameRequired };
  if (displayName.length > 80) return { error: t.errors.nameTooLong };
  if (bio.length > 2000)       return { error: t.errors.bioTooLong };
  if (workplace.length > 120)  return { error: t.errors.workplaceTooLong };
  // Required here too, not only at signup — otherwise an agent could clear the
  // field afterwards and land straight back in the state this was meant to end.
  // It also collects a number from the agents who registered before signup
  // asked for one: they cannot save any profile change without supplying it.
  if (!normalizeVnPhone(phone)) return { error: t.errors.phoneRequired };

  // Read the current row first: the claim (to tell a *new* claim, which needs a
  // human, from an unrelated bio edit) and the name (for the uniqueness check).
  const { data: before } = await supabase
    .from('agent_profiles')
    .select('slug, display_name, listing_agent_name')
    .eq('id', user.id)
    .maybeSingle();

  // Unique names: only when the name's key actually changes, so an agent whose
  // name predates the rule is never locked out of saving their profile.
  const nameT = forLang(AGENT_NAME_COPY, fullLangOf(form));
  if (agentNameKey(displayName) !== agentNameKey(before?.display_name)
      && await nameTaken(displayName, before?.slug)) {
    return { error: nameT.nameTaken(displayName) };
  }

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

  const { error } = await supabase
    .from('agent_profiles')
    .update({
      display_name: displayName,
      bio,
      workplace,
      phone: phone || null,
      has_whatsapp: hasWhatsapp,
      // Claiming a name only records the claim. It has no public effect until an
      // admin verifies it — the RLS policy blocks self-verification and the
      // agent_public view nulls out unverified claims.
      listing_agent_name: listingName || null,
      ...(photoUrl ? { photo_url: photoUrl } : {}),
    })
    .eq('id', user.id);

  if (error) {
    console.error('[account] profile save failed:', error.message);
    if (error.code === UNIQUE_VIOLATION) return { error: nameT.nameTaken(displayName) };
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

  // A newly claimed listing name needs a decision. When the agent's phone is on
  // every phone-bearing listing under that name, the evidence decides it and the
  // claim is approved here (service role: the guard trigger stops the user's own
  // session from setting the flag). Anything else waits for an admin, who gets a
  // ping with the number of listings it would attach — which is what makes an
  // implausible claim obvious at a glance.
  const claimChanged =
    listingName && normalizeAgentName(listingName) !== normalizeAgentName(before?.listing_agent_name);

  if (claimChanged) {
    const [rentals, forSale] = await Promise.all([getListings(), getForSaleListings()]);
    const all = [...rentals, ...forSale];

    if (shouldAutoApproveClaim(listingName, phone, all)) {
      const admin = createAdminClient();
      const { error: approveError } = admin
        ? await admin
          .from('agent_profiles')
          .update({ listing_agent_name_verified: true })
          .eq('id', user.id)
          // Guards a race with a second save that changed the claim meanwhile.
          .eq('listing_agent_name', listingName)
        : { error: { message: 'no service role key' } };
      if (!approveError) {
        if (before?.slug) {
          revalidatePath(`/agent/${before.slug}`);
          revalidatePath(`/vi/moi-gioi/${before.slug}`);
        }
        return { notice: nameT.claimAutoApproved };
      }
      console.error('[account] claim auto-approve failed:', approveError.message);
    }

    after(async () => {
      const target = normalizeAgentName(listingName);
      const matching = all.filter(l => normalizeAgentName(l.agent) === target).length;

      const ev = claimPhoneEvidence(listingName, phone, all);

      await notifyAdmins({
        type: 'listing_claim',
        display_name: displayName,
        profile_url: `${SITE_URL}/agent/${before?.slug ?? ''}`,
        claimed_name: listingName,
        matching_listings: matching,
        phone_check: describePhoneEvidence(ev),
        profile_phone: phone || null,
        phone_matching_listings: ev?.matching ?? 0,
        phone_listings_with_number: ev?.withPhone ?? 0,
        same_phone_other_names: ev?.otherNames ?? [],
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
