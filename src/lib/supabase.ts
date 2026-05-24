import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseClient = createClient(supabaseUrl || "http://localhost", supabaseAnonKey || "dummy");

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase credentials. Check your environment variables.");
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
