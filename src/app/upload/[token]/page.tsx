import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { UploadForm } from "./upload-form";
import { FileUp } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-mesh py-12 px-4">
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="glass rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-float">
              <FileUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              請求書アップロード
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                {vendor.name[0]}
              </div>
              <span className="text-sm font-medium text-indigo-700">{vendor.name} 様</span>
            </div>
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
