import { MetadataRoute } from "next";
import { getSupabaseAdmin } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.lingkoraq.my.id";

  // Static routes
  const staticRoutes = [
    "",
    "/login",
    "/editor",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes (user bio pages)
  let dynamicRoutes: any[] = [];
  try {
    const supabase = getSupabaseAdmin();
    const { data: projects } = await supabase
      .from("projects")
      .select("slug, updated_at")
      .not("slug", "is", null);

    if (projects) {
      dynamicRoutes = projects.map((project) => ({
        url: `${baseUrl}/${project.slug}`,
        lastModified: new Date(project.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Error fetching projects for sitemap:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
