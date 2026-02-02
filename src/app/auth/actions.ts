"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const organizationName = formData.get("organizationName") as string;

  // Create user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
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

  // Create organization
  const { data: org, error: orgError } = await adminClient
    .from("organizations")
    .insert({ name: organizationName })
    .select()
    .single();

  if (orgError) {
    return { error: "組織の作成に失敗しました: " + orgError.message };
  }

  // Create profile
  const { error: profileError } = await adminClient.from("profiles").insert({
    id: authData.user.id,
    organization_id: org.id,
    email: email,
  });

  if (profileError) {
    return { error: "プロフィールの作成に失敗しました: " + profileError.message };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
