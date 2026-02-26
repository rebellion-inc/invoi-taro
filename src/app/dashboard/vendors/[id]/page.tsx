import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Link as LinkIcon, Users, Sparkles } from "lucide-react";
import { VendorDetailForm } from "./vendor-detail-form";

export const metadata: Metadata = {
  title: "取引先詳細",
  description: "取引先情報を確認し、内容を更新できます。",
};

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    notFound();
  }

  const { data: vendor, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .eq("organization_id", profile.organization_id)
    .single();

  if (error || !vendor) {
    notFound();
  }

  return (
    <div>
      <div className="aoi-stage glass rounded-3xl p-6 mb-6">
        <span className="aoi-kicker mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          DETAIL CHECK
        </span>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">取引先詳細</h1>
            <p className="text-gray-500 text-sm">必要なところだけ整えればOK</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Link
          href="/dashboard/vendors"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          一覧に戻る
        </Link>
      </div>

      <div className="aoi-stage rounded-3xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">アップロードURL</p>
            <p className="text-lg font-semibold text-gray-900 break-all">
              /upload/{vendor.upload_token}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">登録日</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(vendor.created_at).toLocaleDateString("ja-JP")}
            </p>
          </div>
          <div className="md:col-span-2">
            <Link
              href={`/upload/${vendor.upload_token}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              アップロードページを開く
            </Link>
          </div>
        </div>
      </div>

      <VendorDetailForm
        vendorId={vendor.id}
        uploadToken={vendor.upload_token}
        initialName={vendor.name}
      />
    </div>
  );
}
