"use client";

import { useActionState } from "react";
import { acceptInvitation, declineInvitation } from "@/app/dashboard/mypage/actions";
import { Mail, Check, X, Loader2 } from "lucide-react";

type Invitation = {
  id: string;
  organization_name: string;
  inviter_email: string;
};

export function InvitationBanner({
  invitations,
}: {
  invitations: Invitation[];
}) {
  if (invitations.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {invitations.map((invitation) => (
        <InvitationItem key={invitation.id} invitation={invitation} />
      ))}
    </div>
  );
}

function InvitationItem({ invitation }: { invitation: Invitation }) {
  const [acceptState, acceptAction, acceptPending] = useActionState(
    async () => {
      return await acceptInvitation(invitation.id);
    },
    null as { error?: string; success?: boolean } | null
  );

  const [declineState, declineAction, declinePending] = useActionState(
    async () => {
      return await declineInvitation(invitation.id);
    },
    null as { error?: string; success?: boolean } | null
  );

  if (acceptState?.success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
        <p className="text-sm text-emerald-700">
          「{invitation.organization_name}」に参加しました。ページを再読み込みしてください。
        </p>
      </div>
    );
  }

  if (declineState?.success) {
    return null;
  }

  const pending = acceptPending || declinePending;
  const error = acceptState?.error || declineState?.error;

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <Mail className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">
            <span className="font-medium">{invitation.inviter_email}</span> さんから
            「<span className="font-medium">{invitation.organization_name}</span>」
            への招待が届いています。参加しますか？
          </p>
          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <form action={acceptAction}>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors"
              >
                {acceptPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                参加する
              </button>
            </form>
            <form action={declineAction}>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-70 transition-colors"
              >
                {declinePending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                辞退する
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
