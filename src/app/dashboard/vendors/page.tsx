import { createClient } from "@/lib/supabase/server";
import { VendorList } from "./vendor-list";
import { CreateVendorForm } from "./create-vendor-form";
import { Users, Plus } from "lucide-react";

export default async function VendorsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user!.id)
    .single();

  const { data: vendors } = await supabase
    .from("vendors")
    .select("*")
    .eq("organization_id", profile!.organization_id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">取引先管理</h1>
          <p className="text-gray-500 text-sm">請求書をアップロードする取引先を管理</p>
        </div>
      </div>
      
      <div className="glass rounded-2xl p-6 mb-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">新規取引先追加</h2>
        </div>
        <CreateVendorForm />
      </div>

      <div className="glass rounded-2xl overflow-hidden animate-fade-in stagger-2 opacity-0">
        <VendorList vendors={vendors || []} />
      </div>
    </div>
  );
}
