import { ImageResponse } from 'next/og';
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = 'edge';

export const alt = 'Lingkoraq Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = 'Lingkoraq Profile';
  let logoUrl = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data: project } = await supabase
      .from("projects")
      .select("title, favicon_url")
      .eq("slug", slug)
      .single();

    if (project) {
      title = project.title || 'Lingkoraq Profile';
      logoUrl = project.favicon_url;
    }
  } catch (e) {}

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d0d1f 0%, #1a0533 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            fontSize: 28,
            fontWeight: 'bold',
            color: '#3b82f6',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 12 }}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          Lingkoraq
        </div>
        
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Avatar"
            style={{
              width: 260,
              height: 260,
              borderRadius: 130,
              objectFit: 'cover',
              marginBottom: 40,
              border: '6px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            }}
          />
        ) : (
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: 130,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              marginBottom: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 120,
              fontWeight: 'bold',
              border: '6px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            }}
          >
            {title.charAt(0).toUpperCase()}
          </div>
        )}

        <div
          style={{
            fontSize: 76,
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>
        
        <div
          style={{
            fontSize: 36,
            color: '#a855f7',
            fontWeight: '600',
            background: 'rgba(168, 85, 247, 0.1)',
            padding: '12px 32px',
            borderRadius: 100,
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}
        >
          lingkoraq.my.id/{slug}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
