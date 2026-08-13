'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import AgentAvatar from '@/components/AgentAvatar';
import {
  setNameVerifiedAction,
  setStatusAction,
  deleteAgentAction,
  type AdminActionState,
} from './actions';

const initial: AdminActionState = {};

export interface AdminAgent {
  id: string;
  slug: string;
  display_name: string;
  bio: string;
  photo_url: string | null;
  workplace: string;
  phone: string | null;
  listing_agent_name: string | null;
  listing_agent_name_verified: boolean;
  status: 'active' | 'suspended';
  is_admin: boolean;
  created_at: string;
  /** Listings in the sheet matching their claimed name, verified or not. */
  claimedListingCount: number;
}

function SmallButton({
  children,
  pending,
  tone = 'plain',
}: {
  children: React.ReactNode;
  pending: boolean;
  tone?: 'plain' | 'primary' | 'danger';
}) {
  const tones = {
    plain: 'border-slate-300 text-slate-700 hover:bg-slate-50',
    primary: 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700',
    danger: 'border-red-300 text-red-700 hover:bg-red-50',
  };
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${tones[tone]}`}
    >
      {pending ? '…' : children}
    </button>
  );
}

export default function AdminAgentRow({ agent }: { agent: AdminAgent }) {
  const [verifyState, verifyAction, verifyPending] = useActionState(setNameVerifiedAction, initial);
  const [statusState, statusAction, statusPending] = useActionState(setStatusAction, initial);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAgentAction, initial);

  const message =
    verifyState.error ?? statusState.error ?? deleteState.error ??
    verifyState.notice ?? statusState.notice ?? deleteState.notice;
  const isError = Boolean(verifyState.error ?? statusState.error ?? deleteState.error);

  return (
    <li className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex gap-4">
        <AgentAvatar src={agent.photo_url} name={agent.display_name} className="w-12 h-12 shrink-0" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/agent/${agent.slug}`} className="font-semibold text-slate-900 hover:underline">
              {agent.display_name}
            </Link>
            {agent.status === 'suspended' && (
              <span className="text-xs rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">Hidden</span>
            )}
            {agent.is_admin && (
              <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">Admin</span>
            )}
          </div>

          <p className="text-sm text-slate-500">
            {agent.workplace} · joined {new Date(agent.created_at).toLocaleDateString('en-GB')}
            {agent.phone && <> · {agent.phone}</>}
          </p>

          <p className="text-sm mt-1">
            {agent.listing_agent_name ? (
              <>
                <span className="text-slate-500">Claims listings as</span>{' '}
                <strong className="text-slate-800">{agent.listing_agent_name}</strong>{' '}
                <span className={agent.claimedListingCount > 0 ? 'text-slate-600' : 'text-amber-700'}>
                  ({agent.claimedListingCount} matching {agent.claimedListingCount === 1 ? 'listing' : 'listings'} in the sheet)
                </span>{' '}
                {agent.listing_agent_name_verified
                  ? <span className="text-emerald-700">— verified</span>
                  : <span className="text-amber-700">— awaiting verification</span>}
              </>
            ) : (
              <span className="text-slate-400">No listing name claimed</span>
            )}
          </p>

          {agent.bio.trim() && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-3 whitespace-pre-line">{agent.bio.trim()}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {agent.listing_agent_name && (
              <form action={verifyAction}>
                <input type="hidden" name="id" value={agent.id} />
                <input type="hidden" name="verified" value={agent.listing_agent_name_verified ? 'false' : 'true'} />
                <SmallButton pending={verifyPending} tone={agent.listing_agent_name_verified ? 'plain' : 'primary'}>
                  {agent.listing_agent_name_verified ? 'Unlink listings' : 'Verify & link listings'}
                </SmallButton>
              </form>
            )}

            <form action={statusAction}>
              <input type="hidden" name="id" value={agent.id} />
              <input type="hidden" name="status" value={agent.status === 'active' ? 'suspended' : 'active'} />
              <SmallButton pending={statusPending}>
                {agent.status === 'active' ? 'Hide profile' : 'Unhide profile'}
              </SmallButton>
            </form>

            <form
              action={deleteAction}
              onSubmit={e => {
                if (!confirm(`Permanently delete ${agent.display_name}'s account? This cannot be undone.`)) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={agent.id} />
              <SmallButton pending={deletePending} tone="danger">Delete</SmallButton>
            </form>
          </div>

          {message && (
            <p className={`mt-2 text-xs ${isError ? 'text-red-700' : 'text-emerald-700'}`}>{message}</p>
          )}
        </div>
      </div>
    </li>
  );
}
