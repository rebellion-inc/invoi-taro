import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const vendorId = formData.get("vendorId") as string;
    const organizationId = formData.get("organizationId") as string;
    const token = formData.get("token") as string;
    const amount = formData.get("amount") as string;
    const invoiceDate = formData.get("invoiceDate") as string;

    if (!file || !vendorId || !organizationId || !token) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ファイルサイズは10MB以下にしてください" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "PDF, PNG, JPG形式のファイルのみアップロードできます" },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify token is valid
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id")
      .eq("id", vendorId)
      .eq("upload_token", token)
      .single();

    if (!vendor) {
      return NextResponse.json(
        { error: "無効なアップロードリンクです" },
        { status: 403 }
      );
    }

    // Generate unique file path
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filePath = `${organizationId}/${vendorId}/${timestamp}.${ext}`;

    // Upload file to storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "ファイルのアップロードに失敗しました" },
        { status: 500 }
      );
    }

    // Create invoice record
    const { error: insertError } = await supabase.from("invoices").insert({
      vendor_id: vendorId,
      organization_id: organizationId,
      file_path: filePath,
      file_name: file.name,
      amount: amount ? parseInt(amount, 10) : null,
      invoice_date: invoiceDate || null,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      // Try to clean up uploaded file
      await supabase.storage.from("invoices").remove([filePath]);
      return NextResponse.json(
        { error: "請求書の登録に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "予期しないエラーが発生しました" },
      { status: 500 }
    );
  }
}
