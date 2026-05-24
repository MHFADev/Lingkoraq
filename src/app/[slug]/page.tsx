import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Project } from "@/types";
import BioView from "@/components/BioView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const supabase = getSupabaseAdmin();
    const { data: project } = await supabase
      .from("projects")
      .select("title, favicon_url, bio, avatar_url")
      .eq("slug", slug)
      .single();
    if (!project) return { title: "Not Found" };
    
    const title = `${project.title} - Professional Bio Link | Lingkoraq`;
    const description = project.bio || `Check out ${project.title}'s bio link page. Created with Lingkoraq - the premium bio link platform.`;
    
    return {
      title,
      description,
      openGraph: {
        title: project.title,
        description,
        type: "profile",
        url: `https://www.lingkoraq.my.id/${slug}`,
        images: [
          {
            url: project.avatar_url || "/og-image.png",
            width: 1200,
            height: 630,
            alt: project.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description,
        images: [project.avatar_url || "/og-image.png"],
      },
      icons: project.favicon_url ? {
        icon: project.favicon_url,
        apple: project.favicon_url,
      } : undefined,
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function PublicPage({ params }: PageProps) {
  const { slug } = await params;
  let project: Project | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();
    project = data as Project | null;
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  return <BioView project={project} />;
}
