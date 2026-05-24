"use server";

import { createClientServer } from "@/lib/supabaseServer";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Project } from "@/types";
import { sanitizeSlug } from "@/lib/utils";

/**
 * Ensure the user record exists in public.users.
 * This fixes FK constraint failures when the trigger `on_auth_user_created`
 * did not run (e.g. existing auth user before trigger setup).
 */
async function ensureUserRecord(user: any) {
  try {
    const supabase = await createClientServer();
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();
    if (existing) return;
  } catch {
    // ignore — record probably does not exist
  }

  try {
    const admin = getSupabaseAdmin();
    await admin.from("users").insert({
      id: user.id,
      email: user.email ?? "",
      username:
        user.user_metadata?.username ??
        user.user_metadata?.user_name ??
        user.email?.split("@")[0] ??
        "user",
      avatar_url: user.user_metadata?.avatar_url ?? null,
    });
  } catch (err: any) {
    // 23505 = unique violation (record already exists)
    if (err?.code !== "23505") {
      console.error("ensureUserRecord failed:", err);
    }
  }
}

export async function createProject(data: {
  slug: string; title: string; html_code: string; css_code: string; js_code: string; preview_img?: string; favicon_url?: string;
}): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized — please sign in again." };

    await ensureUserRecord(user);

    let finalSlug = sanitizeSlug(data.slug);

    // Cek apakah slug sudah digunakan oleh user lain
    const { data: existingSlugProject } = await supabase
      .from("projects")
      .select("id, user_id")
      .eq("slug", finalSlug)
      .maybeSingle();

    if (existingSlugProject) {
      if (existingSlugProject.user_id === user.id) {
        // Jika milik user ini, update project tersebut
        const { data: project, error } = await supabase.from("projects")
          .update({ title: data.title, html_code: data.html_code, css_code: data.css_code, js_code: data.js_code, favicon_url: data.favicon_url, updated_at: new Date().toISOString() })
          .eq("id", existingSlugProject.id).eq("user_id", user.id).select().single();
        if (error) throw error;
        return { success: true, project: project as Project };
      }

      // Jika milik orang lain, coba generate slug alternatif
      let alternativeSlug = finalSlug;
      let counter = 1;
      let foundAvailableSlug = false;
      
      while (counter <= 10) {
        alternativeSlug = `${finalSlug}-${counter}`;
        const { data: checkSlug } = await supabase
          .from("projects")
          .select("id")
          .eq("slug", alternativeSlug)
          .maybeSingle();
        
        if (!checkSlug) {
          foundAvailableSlug = true;
          finalSlug = alternativeSlug;
          break;
        }
        counter++;
      }
      
      if (!foundAvailableSlug) {
        finalSlug = `${finalSlug}-${Math.random().toString(36).slice(2, 8)}`;
      }
    }

    const { data: project, error } = await supabase.from("projects")
      .insert({ user_id: user.id, slug: finalSlug, title: data.title, html_code: data.html_code, css_code: data.css_code, js_code: data.js_code, preview_img: data.preview_img, favicon_url: data.favicon_url })
      .select().single();

    if (error) {
      if (error.code === "23505") {
        // Masih unik violation setelah generator? Berarti ada race condition atau generator gagal.
        return { success: false, error: "Slug is already taken! Please try another one." };
      }
      throw error;
    }
    return { success: true, project: project as Project };
  } catch (err: any) {
    console.error("Create project error:", err);
    return { success: false, error: err.message || "Failed to create project" };
  }
}

export async function updateProject(id: string, data: { slug?: string; title?: string; html_code?: string; css_code?: string; js_code?: string; preview_img?: string; favicon_url?: string; }
): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized — please sign in again." };

    await ensureUserRecord(user);

    const payload: any = { ...data, updated_at: new Date().toISOString() };
    
    // Jika slug diubah, perlu validasi
    if (data.slug) {
      let finalSlug = sanitizeSlug(data.slug);
      
      // Dapatkan slug lama project untuk membandingkan
      const { data: currentProject } = await supabase
        .from("projects")
        .select("slug")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      
      // Jika slug baru sama dengan slug lama, tidak perlu validasi
      if (currentProject && currentProject.slug === finalSlug) {
        payload.slug = finalSlug;
      } else {
        // Cek apakah slug sudah digunakan oleh project lain (siapapun pemiliknya)
        const { data: existingSlugProject } = await supabase
          .from("projects")
          .select("id, user_id")
          .eq("slug", finalSlug)
          .neq("id", id) // Kecualikan project yang sedang di-update ini
          .maybeSingle();
        
        if (existingSlugProject) {
          if (existingSlugProject.user_id === user.id) {
            return { success: false, error: "You are already using this slug on another project! Please use a different one." };
          }

          // Jika milik orang lain, coba generate slug alternatif
          let alternativeSlug = finalSlug;
          let counter = 1;
          let foundAvailableSlug = false;
          
          while (counter <= 10) {
            alternativeSlug = `${finalSlug}-${counter}`;
            const { data: checkSlug } = await supabase
              .from("projects")
              .select("id")
              .eq("slug", alternativeSlug)
              .maybeSingle();
            
            if (!checkSlug) {
              foundAvailableSlug = true;
              finalSlug = alternativeSlug;
              break;
            }
            counter++;
          }
          
          if (!foundAvailableSlug) {
            finalSlug = `${finalSlug}-${Math.random().toString(36).slice(2, 8)}`;
          }
        }
        
        payload.slug = finalSlug;
      }
    }

    // Use maybeSingle() so 0 matching rows returns null instead of throwing PGRST116
    const { data: project, error } = await supabase.from("projects")
      .update(payload).eq("id", id).eq("user_id", user.id).select().maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "This slug is already taken! Please try another one." };
      }
      throw error;
    }

    // Row not found (stale ID) — fall back to creating a new project
    if (!project) {
      const slug = (data.slug ? sanitizeSlug(data.slug) : null) ?? `page-${Math.random().toString(36).slice(2,8)}`;
      const { data: inserted, error: insertErr } = await supabase.from("projects")
        .insert({
          user_id: user.id,
          slug,
          title: data.title ?? "Untitled",
          html_code: data.html_code ?? "",
          css_code: data.css_code ?? "",
          js_code: data.js_code ?? "",
          preview_img: data.preview_img,
          favicon_url: data.favicon_url,
        })
        .select().single();

      if (insertErr) {
        if (insertErr.code === "23505") return { success: false, error: "Slug is already taken by someone else!" };
        throw insertErr;
      }
      return { success: true, project: inserted as Project };
    }

    return { success: true, project: project as Project };
  } catch (err: any) {
    console.error("Update project error:", err);
    return { success: false, error: err.message || "Failed to update project" };
  }
}



export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    const { error } = await supabase.from("projects").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getProjectBySlug(slug: string): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const admin = getSupabaseAdmin();
    const { data: project, error } = await admin.from("projects").select("*").eq("slug", sanitizeSlug(slug)).maybeSingle();
    if (error) throw error;
    if (!project) return { success: false, error: "Project not found" };
    return { success: true, project: project as Project };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getUserProjects(): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
  try {
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    const { data: projects, error } = await supabase.from("projects").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
    if (error) throw error;
    return { success: true, projects: (projects || []) as Project[] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getProjectById(id: string): Promise<{ success: boolean; project?: Project; error?: string }> {
  try {
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };
    const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!project) return { success: false, error: "Project not found" };
    return { success: true, project: project as Project };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function checkSlugTaken(targetSlug: string): Promise<boolean> {
  const admin = getSupabaseAdmin();
  const slug = sanitizeSlug(targetSlug);
  const { data } = await admin.from("projects").select("id").eq("slug", slug).maybeSingle();
  return !!data;
}

// ─── USER PROFILE SYNC ────────────────────────────────────────────────────────
// Saves ALL editor profile state to `user_profiles` table in Supabase
// so it syncs across devices automatically on login.

export async function saveUserProfile(profileData: Record<string, any>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        profile_data: profileData,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("saveUserProfile error:", err);
    return { success: false, error: err.message };
  }
}

export async function loadUserProfile(): Promise<{ success: boolean; data?: Record<string, any>; latestProjectId?: string | null; error?: string }> {
  try {
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Load profile data
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("profile_data")
      .eq("user_id", user.id)
      .maybeSingle();

    // Load most recently updated project
    const { data: latestProject } = await supabase
      .from("projects")
      .select("id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      success: true,
      data: profile?.profile_data ?? null,
      latestProjectId: latestProject?.id ?? null,
    };
  } catch (err: any) {
    console.error("loadUserProfile error:", err);
    return { success: false, error: err.message };
  }
}


