"use client";

import { useActionState } from "react";
import { inviteMember } from "./actions";
import { Loader2, Mail, UserPlus } from "lucide-react";

export function InviteMemberForm() {
  const [state, formAction, pending] = useActionState(
    async (
      _prevState: { error?: string; success?: boolean; invited?: boolean } | null,
      formData: FormData
    ) => {
      return await inviteMember(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          招待するユーザーのメールアドレス
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full pl-12 pr-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
            placeholder="member@example.com"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 px-6 py-3 btn-primary text-white rounded-xl font-medium disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            招待中...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            メンバーを招待
          </>
        )}
      </button>

      {state?.error && (
        <p className="text-sm text-red-600 animate-fade-in">{state.error}</p>
      )}
      {state?.success && !state?.invited && (
        <p className="text-sm text-emerald-600 animate-fade-in">
          招待が完了しました。対象ユーザーを組織に追加しました。
        </p>
      )}
      {state?.success && state?.invited && (
        <p className="text-sm text-emerald-600 animate-fade-in">
          招待メールを送信しました。対象ユーザーが承諾すると組織に追加されます。
        </p>
      )}
    </form>
  );
}
