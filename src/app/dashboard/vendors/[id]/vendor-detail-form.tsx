"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, Save, Trash2 } from "lucide-react";
import { deleteVendor, updateVendorDetails } from "../actions";

type VendorDetailFormProps = {
  vendorId: string;
  uploadToken: string;
  initialName: string;
};

type ActionState = { error?: string; success?: boolean } | null;

export function VendorDetailForm({
  vendorId,
  uploadToken,
  initialName,
}: VendorDetailFormProps) {
  const router = useRouter();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (_prevState: ActionState, formData: FormData) => {
      return await updateVendorDetails(formData);
    },
    null
  );
  const [isDeleting, startDelete] = useTransition();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const copyToClipboard = async () => {
    const url = `${window.location.origin}/upload/${uploadToken}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (!confirm("この取引先を削除しますか？関連する請求書も削除されます。")) {
      return;
    }
    setDeleteError(null);
    startDelete(async () => {
      const result = await deleteVendor(vendorId);
      if (result?.error) {
        setDeleteError(result.error);
        return;
      }
      router.push("/dashboard/vendors");
      router.refresh();
    });
  };

  const notice = deleteError
    ? { type: "error" as const, text: deleteError }
      : state?.error
        ? { type: "error" as const, text: state.error }
      : state?.success
        ? { type: "success" as const, text: "保存できました" }
        : null;

  return (
    <div className="glass rounded-2xl p-6">
      <form
        action={formAction}
        onSubmit={() => setDeleteError(null)}
        className="space-y-6"
      >
        <input type="hidden" name="vendorId" value={vendorId} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              取引先名
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={initialName}
              className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400"
              placeholder="取引先名を入力"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              アップロードURL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`/upload/${uploadToken}`}
                className="w-full px-4 py-3 rounded-xl input-modern text-gray-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className={`inline-flex items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  copied
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
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
