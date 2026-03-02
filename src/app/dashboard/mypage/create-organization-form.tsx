"use client";

import { useActionState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { createOrganization } from "./actions";

export function CreateOrganizationForm() {
  const [state, formAction, pending] = useActionState(
    async (
      _prevState: { error?: string; success?: boolean } | null,
      formData: FormData
    ) => {
      return await createOrganization(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4 mt-4">
      <div>
        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
          新しい組織名
        </label>
        <input
          id="organizationName"
          name="organizationName"
          type="text"
          required
          className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
          placeholder="株式会社〇〇"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 px-6 py-3 btn-primary text-white rounded-xl font-medium disabled:opacity-70"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            作成中...
          </>
        ) : (
          <>
            <Building2 className="w-4 h-4" />
            組織を作成
          </>
        )}
      </button>

      {state?.error && <p className="text-sm text-red-600 animate-fade-in">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-emerald-600 animate-fade-in">
          組織を作成しました。画面を再読み込みすると最新情報が表示されます。
        </p>
      )}
    </form>
  );
}
