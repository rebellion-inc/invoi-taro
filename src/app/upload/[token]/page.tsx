import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { UploadForm } from "./upload-form";
import { FileUp, Sparkles, Heart } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const vendor = await getVendorByToken(token);
  
  if (!vendor) {
    return {
      title: "取引先が見つかりません",
    };
  }

  return {
    title: `請求書アップロード - ${vendor.name}`,
    description: `${vendor.name}様の請求書をアップロードしてください。`,
  };
}

// Use service role to bypass RLS for public upload page
async function getVendorByToken(token: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, name, organization_id")
    .eq("upload_token", token)
    .single();

  return vendor;
}

export default async function UploadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const vendor = await getVendorByToken(token);

  if (!vendor) {
    notFound();
  }

  return (
    <div className="aoi-shell min-h-screen bg-gradient-mesh py-8 px-4">
      <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[0.9fr_1.1fr] animate-fade-in">
        <div className="aoi-stage glass rounded-3xl p-8 lg:p-10">
          <span className="aoi-kicker mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            EASY UPLOAD
          </span>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            請求書を
            <br />
            ふんわり提出
          </h1>
          <p className="text-gray-600 mt-4 leading-relaxed">
            正確さよりも、まず提出できたことが大切です。入力はわかるところだけで大丈夫です。
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/70 rounded-full border border-white/80">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              {vendor.name[0]}
            </div>
            <span className="text-sm font-medium text-indigo-700">{vendor.name} 様向け</span>
          </div>
          <div className="mt-6 text-sm text-gray-700 flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3">
            <Heart className="w-4 h-4 text-rose-500" />
            送信完了まで、最短1分で進められます
          </div>
        </div>

        <div className="glass rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
              <FileUp className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">請求書を送信</h2>
            <p className="text-sm text-gray-500 mt-2">わかる範囲だけの入力で大丈夫です</p>
          </div>
          <UploadForm
            vendorId={vendor.id}
            organizationId={vendor.organization_id}
            token={token}
          />
        </div>
      </div>
    </div>
  );
}
