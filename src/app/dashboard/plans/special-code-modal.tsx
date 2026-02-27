"use client";

import { useActionState, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, X } from "lucide-react";
import { unlockProBySpecialCode } from "./actions";

export function SpecialCodeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error?: string; success?: boolean } | null, formData: FormData) => {
      return await unlockProBySpecialCode(formData);
    },
    null
  );

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Special Access</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Sparkles className="w-4 h-4" />
          Special!
        </button>
      </div>

      {state?.success && (
        <p className="text-sm text-emerald-600 mt-3 animate-fade-in">
          Pro プランを有効化しました。ご利用ありがとうございます。
        </p>
      )}

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="モーダルを閉じる"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-fade-in">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">特別コード入力</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    お持ちのコードを入力してください。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form action={formAction} className="space-y-4">
                <div>
                  <label htmlFor="specialCode" className="block text-sm font-medium text-gray-700 mb-2">
                    コード
                  </label>
                  <input
                    id="specialCode"
                    name="specialCode"
                    type="text"
                    required
                    placeholder="コードを入力"
                    className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
                  />
                </div>

                {state?.error && (
                  <p className="text-sm text-red-600 animate-fade-in">{state.error}</p>
                )}
                {state?.success && (
                  <p className="text-sm text-emerald-600 animate-fade-in">
                    Pro プランを有効化しました。閉じると表示が更新されます。
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-70 transition-colors"
                >
                  {pending ? "確認中..." : "コードを適用"}
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
