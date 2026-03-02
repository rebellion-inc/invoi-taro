"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function resolveSiteOrigin() {
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envOrigin) return envOrigin;

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  if (origin) return origin;

  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) return "http://localhost:3000";

  const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (isLocalHost ? "http" : "https");
  return `${protocol}://${host}`;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const origin = await resolveSiteOrigin();

  const email = ((formData.get("email") as string) ?? "").trim().toLowerCase();
  const password = formData.get("password") as string;
  const organizationName = ((formData.get("organizationName") as string) ?? "").trim();
  const withoutOrganization = formData.get("withoutOrganization") === "true";

  if (!withoutOrganization && !organizationName) {
    return { error: "組織名を入力してください" };
  }

  // Create user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: new URL("/login", origin).toString(),
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "ユーザー作成に失敗しました" };
  }

  // Create organization and profile using service role
  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let organizationId: string | null = null;
  if (!withoutOrganization) {
    const { data: org, error: orgError } = await adminClient
      .from("organizations")
      .insert({ name: organizationName })
      .select()
      .single();

    if (orgError) {
      return { error: "組織の作成に失敗しました: " + orgError.message };
    }

    organizationId = org.id;
  }

  // Create profile
  const { error: profileError } = await adminClient.from("profiles").insert({
    id: authData.user.id,
    organization_id: organizationId,
    email: email,
  });

  if (profileError) {
    return { error: "プロフィールの作成に失敗しました: " + profileError.message };
  }

  redirect("/signup/check-email");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
