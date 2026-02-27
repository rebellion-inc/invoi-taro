import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getPlanLimits, isPlanTier } from "@/lib/plan-limits";
import { sendInvoiceUploadedNotification } from "@/lib/notifications/invoice-notifications";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const vendorId = formData.get("vendorId") as string;
    const token = formData.get("token") as string;
    const amount = formData.get("amount") as string;
    const invoiceDate = formData.get("invoiceDate") as string;

    if (!file || !vendorId || !token) {
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
    const { data: vendor, error: vendorError } = await supabase
      .from("vendors")
      .select("id, organization_id, name")
      .eq("id", vendorId)
      .eq("upload_token", token)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json(
        { error: "無効なアップロードリンクです" },
        { status: 403 }
      );
    }

    const { data: organization, error: organizationError } = await supabase
      .from("organizations")
      .select("plan_tier")
      .eq("id", vendor.organization_id)
      .single();

    if (organizationError || !organization?.plan_tier) {
      return NextResponse.json(
        { error: "プラン情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    if (!isPlanTier(organization.plan_tier)) {
      return NextResponse.json(
        { error: "プラン設定が不正です" },
        { status: 500 }
      );
    }

    const planLimits = getPlanLimits(organization.plan_tier);
    if (planLimits.maxInvoices !== null) {
      const { count: invoiceCount, error: countError } = await supabase
        .from("invoices")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", vendor.organization_id);

      if (countError) {
        return NextResponse.json(
          { error: "請求書数の確認に失敗しました" },
          { status: 500 }
        );
      }

      if ((invoiceCount ?? 0) >= planLimits.maxInvoices) {
        return NextResponse.json(
          {
            error: `現在のプランの上限に達しています（受取可能請求書は最大${planLimits.maxInvoices}件）`,
          },
          { status: 403 }
        );
      }
    }

    // Generate unique file path
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filePath = `${vendor.organization_id}/${vendorId}/${timestamp}.${ext}`;

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
    const { data: invoice, error: insertError } = await supabase
      .from("invoices")
      .insert({
        vendor_id: vendorId,
        organization_id: vendor.organization_id,
        file_path: filePath,
        file_name: file.name,
        amount: amount ? parseInt(amount, 10) : null,
        invoice_date: invoiceDate || null,
      })
      .select("id, organization_id, file_name, amount, invoice_date")
      .single();

    if (insertError || !invoice) {
      console.error("Insert error:", insertError);
      // Try to clean up uploaded file
      await supabase.storage.from("invoices").remove([filePath]);
      return NextResponse.json(
        { error: "請求書の登録に失敗しました" },
        { status: 500 }
      );
    }

    try {
      await sendInvoiceUploadedNotification({
        supabase,
        invoiceId: invoice.id,
        organizationId: invoice.organization_id,
        vendorName: vendor.name,
        fileName: invoice.file_name,
        amount: invoice.amount,
        invoiceDate: invoice.invoice_date,
      });
    } catch (notificationError) {
      console.error("Upload notification error:", notificationError);
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
