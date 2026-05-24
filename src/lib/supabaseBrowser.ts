"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClientBrowser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
