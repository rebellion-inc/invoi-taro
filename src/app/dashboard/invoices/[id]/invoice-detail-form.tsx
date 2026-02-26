"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Trash2 } from "lucide-react";
import { deleteInvoice, updateInvoiceDetails } from "../../actions";

type InvoiceDetailFormProps = {
  invoiceId: string;
  initialAmount: number | null;
  initialInvoiceDate: string | null;
  initialStatus: "paid" | "unpaid";
};

type ActionState = { error?: string; success?: boolean } | null;

export function InvoiceDetailForm({
  invoiceId,
  initialAmount,
  initialInvoiceDate,
  initialStatus,
}: InvoiceDetailFormProps) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => {
      return await updateInvoiceDetails(formData);
    },
    null
  );
  const [isDeleting, startDelete] = useTransition();

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state, router]);

  const handleDelete = () => {
    if (!confirm("この請求書を削除しますか？ファイルも削除されます。")) {
      return;
    }
    setDeleteError(null);
    startDelete(async () => {
      const result = await deleteInvoice(invoiceId);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      router.push("/dashboard/invoices");
      router.refresh();
    });
  };

  const notice = deleteError
    ? { type: "error" as const, text: deleteError }
    : state?.error
      ? { type: "error" as const, text: state.error }
      : state?.success
        ? { type: "success" as const, text: "保存しました" }
        : null;

  return (
    <div className="glass rounded-2xl p-6">
      <form
        action={formAction}
        onSubmit={() => setDeleteError(null)}
        className="space-y-6"
      >
        <input type="hidden" name="invoiceId" value={invoiceId} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              請求金額
            </label>
            <input
              name="amount"
              type="number"
              min="0"
              step="1"
              defaultValue={initialAmount ?? ""}
              className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400"
              placeholder="例: 120000"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              請求期日
            </label>
            <input
              name="invoiceDate"
              type="date"
              defaultValue={initialInvoiceDate ?? ""}
              className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              name="status"
              defaultValue={initialStatus}
              className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
            >
              <option value="unpaid">未振込</option>
              <option value="paid">振込済</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 btn-primary text-white rounded-xl font-medium disabled:opacity-70"
          >
            {pending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                変更を保存
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                削除中...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                削除
              </>
            )}
          </button>
        </div>
      </form>

      {notice && (
        <p
          className={`mt-4 text-sm ${
            notice.type === "error" ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {notice.text}
        </p>
      )}
    </div>
  );
}
