export interface Preset {
  id: string;
  name: string;
  category: "profile" | "buttons" | "cards" | "social" | "effects";
  icon: string;
  html: string;
  css: string;
}

export const PRESETS: Preset[] = [
  {
    id: "profile-glass",
    name: "Glass Profile",
    category: "profile",
    icon: "👤",
    html: `<div class="lq-glass-profile">
  <div class="lq-gp-ring"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" class="lq-gp-avatar" alt="Avatar"/></div>
  <h1 class="lq-gp-name">Your Name</h1>
  <p class="lq-gp-bio">Your bio goes here. Keep it short and sweet.</p>
</div>`,
    css: `.lq-glass-profile{display:flex;flex-direction:column;align-items:center;padding:40px 24px;background:rgba(255,255,255,0.07);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.13);border-radius:28px;max-width:320px;margin:20px auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)}.lq-gp-ring{padding:4px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7);margin-bottom:18px}.lq-gp-avatar{width:110px;height:110px;border-radius:50%;object-fit:cover;border:3px solid #0a0a0f;display:block}.lq-gp-name{color:#fff;font-size:22px;font-weight:700;margin:0 0 8px}.lq-gp-bio{color:rgba(255,255,255,0.55);font-size:14px;text-align:center;line-height:1.6;margin:0}`,
  },
  {
    id: "profile-neon",
    name: "Neon Profile",
    category: "profile",
    icon: "🌟",
    html: `<div class="lq-neon-profile">
  <div class="lq-np-glow"></div>
  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" class="lq-np-avatar" alt="Avatar"/>
  <h1 class="lq-np-name">Jane Doe</h1>
  <p class="lq-np-role">UI/UX Designer</p>
</div>`,
    css: `.lq-neon-profile{position:relative;display:flex;flex-direction:column;align-items:center;padding:48px 28px 36px;background:#0d0d1a;border-radius:24px;max-width:320px;margin:20px auto;overflow:hidden}.lq-np-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:200px;height:200px;background:radial-gradient(circle,rgba(99,102,241,0.4),transparent 70%);border-radius:50%;pointer-events:none}.lq-np-avatar{width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #6366f1;box-shadow:0 0 24px rgba(99,102,241,0.5);margin-bottom:16px;position:relative}.lq-np-name{color:#fff;font-size:22px;font-weight:700;margin:0 0 6px;position:relative}.lq-np-role{color:#a5b4fc;font-size:13px;margin:0;text-transform:uppercase;letter-spacing:.1em;position:relative}`,
  },
  {
    id: "btn-gradient",
    name: "Gradient Button",
    category: "buttons",
    icon: "✨",
    html: `<a href="#" class="lq-btn-grad">✨ My Portfolio</a>`,
    css: `.lq-btn-grad{display:block;padding:14px 20px;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;border-radius:14px;text-align:center;font-weight:600;font-size:15px;transition:all .3s;box-shadow:0 4px 24px rgba(99,102,241,0.35);margin:8px 0}.lq-btn-grad:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(99,102,241,0.5)}`,
  },
  {
    id: "btn-glass",
    name: "Glass Button",
    category: "buttons",
    icon: "🪟",
    html: `<a href="#" class="lq-btn-glass">🐙 GitHub</a>`,
    css: `.lq-btn-glass{display:block;padding:14px 20px;background:rgba(255,255,255,0.08);backdrop-filter:blur(10px);color:#fff;text-decoration:none;border-radius:14px;text-align:center;font-weight:600;font-size:15px;border:1px solid rgba(255,255,255,0.15);transition:all .3s;margin:8px 0}.lq-btn-glass:hover{background:rgba(255,255,255,0.15);transform:translateY(-2px)}`,
  },
  {
    id: "btn-neon",
    name: "Neon Outline",
    category: "buttons",
    icon: "💜",
    html: `<a href="#" class="lq-btn-neon">⚡ Contact Me</a>`,
    css: `.lq-btn-neon{display:block;padding:14px 20px;background:transparent;color:#a855f7;text-decoration:none;border-radius:14px;text-align:center;font-weight:600;font-size:15px;border:2px solid #a855f7;box-shadow:0 0 12px rgba(168,85,247,0.3);transition:all .3s;margin:8px 0}.lq-btn-neon:hover{background:rgba(168,85,247,0.1);box-shadow:0 0 24px rgba(168,85,247,0.5);transform:translateY(-2px)}`,
  },
  {
    id: "btn-social-row",
    name: "Social Row",
    category: "buttons",
    icon: "🔗",
    html: `<div class="lq-social-row">
  <a href="#" class="lq-sr-btn">𝕏 Twitter</a>
  <a href="#" class="lq-sr-btn">📸 Instagram</a>
  <a href="#" class="lq-sr-btn">💼 LinkedIn</a>
  <a href="#" class="lq-sr-btn">🐙 GitHub</a>
</div>`,
    css: `.lq-social-row{display:flex;flex-direction:column;gap:10px;width:100%;max-width:320px;margin:16px auto}.lq-sr-btn{display:block;padding:13px 20px;background:rgba(255,255,255,0.06);color:#fff;text-decoration:none;border-radius:12px;text-align:center;font-weight:500;font-size:14px;border:1px solid rgba(255,255,255,0.1);transition:all .25s}.lq-sr-btn:hover{background:rgba(255,255,255,0.12);transform:translateY(-1px)}`,
  },
  {
    id: "card-stats",
    name: "Stats Card",
    category: "cards",
    icon: "📊",
    html: `<div class="lq-stats-card">
  <div class="lq-stat"><span class="lq-stat-num">12K</span><span class="lq-stat-label">Followers</span></div>
  <div class="lq-stat-div"></div>
  <div class="lq-stat"><span class="lq-stat-num">248</span><span class="lq-stat-label">Projects</span></div>
  <div class="lq-stat-div"></div>
  <div class="lq-stat"><span class="lq-stat-num">5★</span><span class="lq-stat-label">Rating</span></div>
</div>`,
    css: `.lq-stats-card{display:flex;align-items:center;justify-content:space-around;padding:20px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:18px;max-width:320px;margin:16px auto}.lq-stat{display:flex;flex-direction:column;align-items:center;gap:4px}.lq-stat-num{font-size:22px;font-weight:700;color:#fff}.lq-stat-label{font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.08em}.lq-stat-div{width:1px;height:36px;background:rgba(255,255,255,0.08)}`,
  },
  {
    id: "card-featured",
    name: "Featured Card",
    category: "cards",
    icon: "🃏",
    html: `<div class="lq-feat-card">
  <div class="lq-fc-badge">Featured</div>
  <h3 class="lq-fc-title">My Latest Project</h3>
  <p class="lq-fc-desc">A brief description of what makes this project awesome.</p>
  <a href="#" class="lq-fc-btn">View Project →</a>
</div>`,
    css: `.lq-feat-card{padding:24px;background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.1));border:1px solid rgba(99,102,241,0.25);border-radius:20px;max-width:320px;margin:16px auto}.lq-fc-badge{display:inline-block;padding:4px 10px;background:rgba(99,102,241,0.3);color:#a5b4fc;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px}.lq-fc-title{color:#fff;font-size:18px;font-weight:700;margin:0 0 8px}.lq-fc-desc{color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;margin:0 0 16px}.lq-fc-btn{display:inline-block;color:#a5b4fc;font-size:13px;font-weight:600;text-decoration:none}`,
  },
  {
    id: "social-icons",
    name: "Social Icons",
    category: "social",
    icon: "🌐",
    html: `<div class="lq-sicons">
  <a href="#" class="lq-si" title="X/Twitter"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
  <a href="#" class="lq-si" title="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
  <a href="#" class="lq-si" title="Instagram"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
  <a href="#" class="lq-si" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
</div>`,
    css: `.lq-sicons{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:16px auto}.lq-si{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.1);text-decoration:none;transition:all .25s}.lq-si:hover{background:rgba(255,255,255,0.14);color:#fff;transform:translateY(-2px)}`,
  },
  {
    id: "effect-orbs",
    name: "Floating Orbs BG",
    category: "effects",
    icon: "🌊",
    html: `<div class="lq-orbs" aria-hidden="true">
  <div class="lq-orb lq-orb1"></div>
  <div class="lq-orb lq-orb2"></div>
  <div class="lq-orb lq-orb3"></div>
</div>`,
    css: `.lq-orbs{position:fixed;inset:0;pointer-events:none;z-index:-1;overflow:hidden}.lq-orb{position:absolute;border-radius:50%;filter:blur(80px);animation:lq-float 8s ease-in-out infinite}.lq-orb1{width:300px;height:300px;background:rgba(99,102,241,0.2);top:10%;left:10%;animation-delay:0s}.lq-orb2{width:250px;height:250px;background:rgba(168,85,247,0.15);top:60%;right:10%;animation-delay:-3s}.lq-orb3{width:200px;height:200px;background:rgba(236,72,153,0.12);bottom:20%;left:40%;animation-delay:-5s}@keyframes lq-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}`,
  },
  {
    id: "effect-badge",
    name: "Status Badge",
    category: "effects",
    icon: "🟢",
    html: `<div class="lq-badge"><span class="lq-badge-dot"></span>Available for hire</div>`,
    css: `.lq-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:20px;color:#4ade80;font-size:13px;font-weight:500;margin:8px 0}.lq-badge-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:lq-pulse 2s ease infinite;flex-shrink:0}@keyframes lq-pulse{0%,100%{opacity:1}50%{opacity:.4}}`,
  },
  {
    id: "effect-gradbg",
    name: "Dark Gradient BG",
    category: "effects",
    icon: "🎨",
    html: `<div class="lq-gradbg"></div>`,
    css: `.lq-gradbg{position:fixed;inset:0;background:linear-gradient(135deg,#0d0d1f 0%,#1a0533 50%,#0f172a 100%);z-index:-2}`,
  },
];

export const PRESET_CATEGORIES = [
  { id: "profile", label: "Profile", emoji: "👤" },
  { id: "buttons", label: "Buttons", emoji: "🔘" },
  { id: "cards", label: "Cards", emoji: "🃏" },
  { id: "social", label: "Social", emoji: "🌐" },
  { id: "effects", label: "Effects", emoji: "✨" },
] as const;
