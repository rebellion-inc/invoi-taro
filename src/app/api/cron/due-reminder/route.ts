import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendInvoiceDueReminderNotification } from "@/lib/notifications/invoice-notifications";

function getJstDateTimeParts(now: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;

  if (!year || !month || !day || !hour) {
    throw new Error("JST date parts could not be generated");
  }

  return {
    dateJst: `${year}-${month}-${day}`,
    hourJst: Number.parseInt(hour, 10),
  };
}

function getVendorName(vendors: unknown) {
  if (!vendors) {
    return "不明";
  }
  if (Array.isArray(vendors)) {
    const first = vendors[0];
    if (typeof first === "object" && first && "name" in first && typeof first.name === "string") {
      return first.name;
    }
    return "不明";
  }
  if (typeof vendors === "object" && "name" in vendors && typeof vendors.name === "string") {
    return vendors.name;
  }
  return "不明";
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET is not set" }, { status: 500 });
  }

  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dateJst, hourJst } = getJstDateTimeParts(new Date());
  if (hourJst !== 9) {
    return NextResponse.json({
      success: true,
      skipped: "outside_schedule",
      dateJst,
      hourJst,
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase environment variables are not set" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("id, organization_id, file_name, amount, invoice_date, vendors(name)")
    .eq("status", "unpaid")
    .eq("invoice_date", dateJst);

  if (error) {
    return NextResponse.json(
      { error: `Failed to fetch due invoices: ${error.message}` },
      { status: 500 }
    );
  }

  let sentCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const invoice of invoices ?? []) {
    try {
      const result = await sendInvoiceDueReminderNotification({
        supabase,
        invoiceId: invoice.id,
        organizationId: invoice.organization_id,
        vendorName: getVendorName(invoice.vendors),
        fileName: invoice.file_name,
        amount: invoice.amount,
        invoiceDate: invoice.invoice_date,
        reminderDateJst: dateJst,
      });

      if (result.sent) {
        sentCount += 1;
      } else {
        skippedCount += 1;
      }
    } catch (notificationError) {
      failedCount += 1;
      console.error("Due reminder notification error:", notificationError);
    }
  }

  return NextResponse.json({
    success: true,
    dateJst,
    totalInvoices: invoices?.length ?? 0,
    sentCount,
    skippedCount,
    failedCount,
  });
}
