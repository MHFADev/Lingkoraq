export interface User { id: string; email: string; username: string; avatar_url?: string; created_at: string; }
export interface Project { id: string; user_id: string; slug: string; title: string; html_code: string; css_code: string; js_code: string; preview_img?: string; favicon_url?: string; created_at: string; updated_at: string; }
export interface LinkButton { id: string; label: string; url: string; iconId: string; style: "gradient" | "glass" | "neon" | "solid" | "minimal"; color?: string; visible: boolean; }
