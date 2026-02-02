import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = path.join("/");

  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // Get user's organization
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "プロフィールが見つかりません" }, { status: 403 });
  }

  // Verify the file belongs to user's organization
  const organizationId = filePath.split("/")[0];
  if (organizationId !== profile.organization_id) {
    return NextResponse.json({ error: "アクセス権限がありません" }, { status: 403 });
  }

  // Get signed URL for the file
  const { data, error } = await supabase.storage
    .from("invoices")
    .createSignedUrl(filePath, 60); // 60 seconds expiry

  if (error || !data) {
    return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 404 });
  }

  // Redirect to signed URL
  return NextResponse.redirect(data.signedUrl);
}
