'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export interface AdminActionState {
  error?: string;
  notice?: string;
}

/** Confirms the caller is an admin and hands back their session client.
 *
 *  Row level security would block a non-admin anyway, but failing loudly here
 *  gives a real error message instead of a silent no-op, and keeps the check
 *  next to the mutation rather than trusting the page that rendered the button. */
async function requireAdmin() {
  if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' as const };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You are not signed in.' as const };

  const { data } = await supabase
    .from('agent_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!data?.is_admin) return { error: 'You do not have admin access.' as const };
  return { supabase };
}

function refresh(slug?: string | null) {
  revalidatePath('/admin/agents');
  revalidatePath('/agents');
  if (slug) revalidatePath(`/agent/${slug}`);
}

/** Approve (or revoke) an agent's claim on a name in the listings sheet.
 *  Until this is set, the public view serves their listing_agent_name as NULL
 *  and their profile shows no properties. */
export async function setNameVerifiedAction(
  _prev: AdminActionState,
  form: FormData,
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const id = String(form.get('id') ?? '');
  const verified = form.get('verified') === 'true';
  if (!id) return { error: 'Missing profile id.' };

  const { data, error } = await auth.supabase
    .from('agent_profiles')
    .update({ listing_agent_name_verified: verified })
    .eq('id', id)
    .select('slug')
    .maybeSingle();

  if (error) return { error: error.message };
  refresh(data?.slug);
  return { notice: verified ? 'Listings linked to this profile.' : 'Listing link removed.' };
}

/** Hide a profile from the public site without destroying the account. */
export async function setStatusAction(
  _prev: AdminActionState,
  form: FormData,
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const id = String(form.get('id') ?? '');
  const status = form.get('status') === 'suspended' ? 'suspended' : 'active';
  if (!id) return { error: 'Missing profile id.' };

  const { data, error } = await auth.supabase
    .from('agent_profiles')
    .update({ status })
    .eq('id', id)
    .select('slug')
    .maybeSingle();

  if (error) return { error: error.message };
  refresh(data?.slug);
  return { notice: status === 'suspended' ? 'Profile hidden from the site.' : 'Profile is live again.' };
}

/** Permanently delete a spam signup — the auth user and, by cascade, the profile.
 *
 *  Deleting only the profile row would strand a live account with nothing to sign
 *  in to, so this deliberately refuses rather than half-deleting when the
 *  service-role key is absent. */
export async function deleteAgentAction(
  _prev: AdminActionState,
  form: FormData,
): Promise<AdminActionState> {
  const auth = await requireAdmin();
  if ('error' in auth) return { error: auth.error };

  const id = String(form.get('id') ?? '');
  if (!id) return { error: 'Missing profile id.' };

  const admin = createAdminClient();
  if (!admin) {
    return {
      error:
        'Deleting accounts needs SUPABASE_SERVICE_ROLE_KEY to be set. Use “Hide” instead, which works without it.',
    };
  }

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };

  refresh();
  return { notice: 'Account deleted.' };
}
