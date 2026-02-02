"use client";

import { useState } from "react";
import { Upload, CheckCircle, FileUp, Calendar, JapaneseYen, Loader2, RefreshCw } from "lucide-react";

type Props = {
  vendorId: string;
  organizationId: string;
  token: string;
};

export function UploadForm({ vendorId, organizationId, token }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("vendorId", vendorId);
      formData.append("organizationId", organizationId);
      formData.append("token", token);
      if (amount) formData.append("amount", amount);
      if (invoiceDate) formData.append("invoiceDate", invoiceDate);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "アップロードに失敗しました");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  if (success) {
    return (
      <div className="text-center animate-fade-in py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          アップロード完了
        </h2>
        <p className="text-gray-600 mb-8">
          請求書のアップロードが完了しました。
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFile(null);
            setAmount("");
            setInvoiceDate("");
          }}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          別の請求書をアップロードする
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 animate-fade-in border border-red-100">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          請求書ファイル <span className="text-red-500">*</span>
        </label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : file
              ? "border-emerald-300 bg-emerald-50"
              : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {file ? (
            <div className="animate-fade-in">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileUp className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                ファイルをドラッグ&ドロップ
              </p>
              <p className="text-xs text-gray-400 mt-1">
                または、クリックして選択
              </p>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          PDF, PNG, JPG形式（最大10MB）
        </p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <JapaneseYen className="w-4 h-4" />
          請求金額（任意）
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-10 pr-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4" />
          請求期日（任意）
        </label>
        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl input-modern text-gray-900 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!file || uploading}
        className="w-full py-4 btn-primary text-white rounded-xl font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            アップロード中...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            アップロード
          </>
        )}
      </button>
    </form>
  );
}
