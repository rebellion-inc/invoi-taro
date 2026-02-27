"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { createPortal } from "react-dom";
import { createManualInvoice } from "../actions";

type VendorOption = {
  id: string;
  name: string;
};

type Props = {
  vendors: VendorOption[];
};

type ActionState = { error?: string; success?: boolean } | null;

export function CreateManualInvoiceForm({ vendors }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => {
      const result = await createManualInvoice(formData);
      if (result?.success) {
        formRef.current?.reset();
        setIsOpen(false);
        router.refresh();
      }
      return result;
    },
    null
  );

  const modal = isOpen && typeof document !== "undefined"
    ? createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/40 p-4 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <form
            ref={formRef}
            action={formAction}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 border border-gray-100 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">手動で請求書を追加</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                閉じる
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">取引先</label>
                <select
                  name="vendorId"
                  required
                  defaultValue=""
                  className="w-full px-3 py-2.5 rounded-xl input-modern text-sm text-gray-900 focus:outline-none"
                >
                  <option value="" disabled>
                    取引先を選択
                  </option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">請求書ファイル</label>
                <input
                  name="file"
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="w-full px-3 py-2 rounded-xl input-modern text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">請求金額（任意）</label>
                <input
                  name="amount"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="例: 120000"
                  className="w-full px-3 py-2.5 rounded-xl input-modern text-sm text-gray-900 focus:outline-none placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">請求期日（任意）</label>
                <input
                  name="invoiceDate"
                  type="date"
                  className="w-full px-3 py-2.5 rounded-xl input-modern text-sm text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl btn-primary text-white text-sm font-medium disabled:opacity-70"
              >
                {pending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    追加中...
                  </>
                ) : (
                  "追加する"
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center px-4 py-2 rounded-xl text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                キャンセル
              </button>
              {state?.error ? (
                <p className="text-sm text-red-500">{state.error}</p>
              ) : state?.success ? (
                <p className="text-sm text-emerald-600">請求書を追加しました。</p>
              ) : null}
            </div>
          </form>
        </div>,
        document.body
      )
    : null;

  if (vendors.length === 0) {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          手動で請求書を追加
        </button>
        <p className="text-sm text-gray-500">
          先に
          <Link href="/dashboard/vendors" className="text-indigo-600 hover:text-indigo-800 mx-1">
            取引先管理
          </Link>
          で取引先を登録してください。
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        手動で請求書を追加
      </button>

      {modal}
    </div>
  );
}
