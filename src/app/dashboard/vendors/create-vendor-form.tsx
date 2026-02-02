"use client";

import { createVendor } from "./actions";
import { useActionState } from "react";
import { Loader2, Plus } from "lucide-react";

export function CreateVendorForm() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await createVendor(formData);
    },
    null
  );

  return (
    <form action={formAction} className="flex gap-4 items-end">
      <div className="flex-1">
        <input
          name="name"
          type="text"
          required
          placeholder="取引先名を入力"
          className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400"
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
            追加中...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            追加
          </>
        )}
      </button>
      {state?.error && (
        <span className="text-red-500 text-sm self-center animate-fade-in">{state.error}</span>
      )}
    </form>
  );
}
