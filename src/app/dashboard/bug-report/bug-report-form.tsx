"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { createBugReport } from "./actions";

type BugReportFormProps = {
  defaultPagePath: string;
};

type FormState = { error?: string; success?: boolean } | null;

export function BugReportForm({ defaultPagePath }: BugReportFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prevState: FormState, formData: FormData) => {
      return await createBugReport(formData);
    },
    null
  );

  return (
    <form action={formAction} className="glass rounded-2xl p-6 space-y-5">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          件名
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          placeholder="例: 請求書詳細画面で保存できない"
          className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          詳細
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={8}
          maxLength={4000}
          placeholder="発生手順、期待する動作、実際の動作などを入力してください。"
          className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400 resize-y"
        />
      </div>

      <div>
        <label
          htmlFor="pagePath"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          発生ページ（任意）
        </label>
        <input
          id="pagePath"
          name="pagePath"
          type="text"
          maxLength={500}
          defaultValue={defaultPagePath}
          placeholder="/dashboard/invoices"
          className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition-colors disabled:opacity-70"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              送信中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              バグを報告
            </>
          )}
        </button>

        {state?.error ? (
          <p className="text-sm text-red-500">{state.error}</p>
        ) : state?.success ? (
          <p className="text-sm text-emerald-600">
            バグレポートを送信しました。ご協力ありがとうございます。
          </p>
        ) : null}
      </div>
    </form>
  );
}
