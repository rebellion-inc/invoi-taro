import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getPlanLimits, isPlanTier } from "@/lib/plan-limits";

type InvoiceRow = {
  file_name: string;
  amount: number | null;
  invoice_date: string | null;
  status: "paid" | "unpaid";
  uploaded_at: string;
  vendors: { name: string } | { name: string }[] | null;
};

const uploadedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const escapeCsvValue = (value: string) => {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, "\"\"")}"`;
  }
  return value;
};

const toCsvRow = (values: Array<string | number | null>) =>
  values
    .map((value) => escapeCsvValue(value == null ? "" : String(value)))
    .join(",");

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  const status = request.nextUrl.searchParams.get("status");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    return NextResponse.json({ error: "プロフィールが見つかりません" }, { status: 403 });
  }

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("plan_tier")
    .eq("id", profile.organization_id)
    .single();
  if (organizationError || !organization?.plan_tier) {
    return NextResponse.json({ error: "プラン情報の取得に失敗しました" }, { status: 500 });
  }
  if (!isPlanTier(organization.plan_tier)) {
    return NextResponse.json({ error: "プラン設定が不正です" }, { status: 500 });
  }
  if (!getPlanLimits(organization.plan_tier).canExportCsv) {
    return NextResponse.json(
      { error: "現在のプランではCSV出力を利用できません" },
      { status: 403 }
    );
  }

  let query = supabase
    .from("invoices")
    .select("file_name, amount, invoice_date, status, uploaded_at, vendors(name)")
    .eq("organization_id", profile.organization_id)
    .order("uploaded_at", { ascending: false });

  if (month && month !== "all") {
    const match = /^(\d{4})-(\d{2})$/.exec(month);
    if (!match) {
      return NextResponse.json({ error: "月の形式が不正です" }, { status: 400 });
    }

    const year = Number(match[1]);
    const monthNumber = Number(match[2]);
    if (monthNumber < 1 || monthNumber > 12) {
      return NextResponse.json({ error: "月の値が不正です" }, { status: 400 });
    }

    const startDate = `${year}-${String(monthNumber).padStart(2, "0")}-01`;
    const nextMonthStart =
      monthNumber === 12
        ? `${year + 1}-01-01`
        : `${year}-${String(monthNumber + 1).padStart(2, "0")}-01`;
    query = query.gte("invoice_date", startDate).lt("invoice_date", nextMonthStart);
  }

  if (status && status !== "all") {
    if (status !== "paid" && status !== "unpaid") {
      return NextResponse.json({ error: "ステータスが不正です" }, { status: 400 });
    }
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json(
      { error: "CSV出力データの取得に失敗しました: " + error.message },
      { status: 500 }
    );
  }

  const invoices = (data ?? []) as InvoiceRow[];
  const header = [
    "取引先名",
    "ファイル名",
    "請求金額",
    "請求期日",
    "アップロード日",
    "ステータス",
  ];
  const rows = invoices.map((invoice) => {
    const vendorName = Array.isArray(invoice.vendors)
      ? (invoice.vendors[0]?.name ?? "")
      : (invoice.vendors?.name ?? "");
    return toCsvRow([
      vendorName,
      invoice.file_name,
      invoice.amount,
      invoice.invoice_date,
      uploadedAtFormatter.format(new Date(invoice.uploaded_at)),
      invoice.status === "paid" ? "振込済" : "未振込",
    ]);
  });

  const csv = `\uFEFF${[toCsvRow(header), ...rows].join("\r\n")}`;
  const filename = month && month !== "all" ? `invoices-${month}.csv` : "invoices.csv";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "no-store",
    },
  });
}
