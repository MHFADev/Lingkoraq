// src/lib/avatarBorders.ts

export type BorderCategory = "formal" | "semi-formal" | "informal" | "artistic" | "cyber";

export interface AvatarBorder {
  id: string;
  name: string;
  category: BorderCategory;
  className: string;
}

export const AVATAR_BORDERS: AvatarBorder[] = [
  // --- FORMAL (12) ---
  { id: "none", name: "None", category: "formal", className: "" },
  { id: "f-solid-thin", name: "Classic Thin", category: "formal", className: "lq-border-f-solid-thin" },
  { id: "f-solid-thick", name: "Classic Thick", category: "formal", className: "lq-border-f-solid-thick" },
  { id: "f-double", name: "Double Line", category: "formal", className: "lq-border-f-double" },
  { id: "f-glow-subtle", name: "Subtle Glow", category: "formal", className: "lq-border-f-glow-subtle" },
  { id: "f-elegant-gold", name: "Elegant Gold", category: "formal", className: "lq-border-f-elegant-gold" },
  { id: "f-inset", name: "Inset Shadow", category: "formal", className: "lq-border-f-inset" },
  { id: "f-pulse-slow", name: "Slow Pulse", category: "formal", className: "lq-border-f-pulse-slow" },
  { id: "f-minimal-dots", name: "Minimal Dots", category: "formal", className: "lq-border-f-minimal-dots" },
  { id: "f-corporate", name: "Corporate Blue", category: "formal", className: "lq-border-f-corporate" },
  { id: "f-silver-silk", name: "Silver Silk", category: "formal", className: "lq-border-f-silver-silk" },
  { id: "f-platinum", name: "Platinum Edge", category: "formal", className: "lq-border-f-platinum" },

  // --- SEMI-FORMAL (12) ---
  { id: "s-rotate-gradient", name: "Rotating Ring", category: "semi-formal", className: "lq-border-s-rotate-gradient" },
  { id: "s-dual-spin", name: "Dual Spinner", category: "semi-formal", className: "lq-border-s-dual-spin" },
  { id: "s-ripple", name: "Soft Ripple", category: "semi-formal", className: "lq-border-s-ripple" },
  { id: "s-dash-spin", name: "Dashed Spin", category: "semi-formal", className: "lq-border-s-dash-spin" },
  { id: "s-corner-blink", name: "Corner Accents", category: "semi-formal", className: "lq-border-s-corner-blink" },
  { id: "s-breath", name: "Breathing Glow", category: "semi-formal", className: "lq-border-s-breath" },
  { id: "s-glass-ring", name: "Glass Ring", category: "semi-formal", className: "lq-border-s-glass-ring" },
  { id: "s-geometric", name: "Geometric Path", category: "semi-formal", className: "lq-border-s-geometric" },
  { id: "s-hologram", name: "Holo Edge", category: "semi-formal", className: "lq-border-s-hologram" },
  { id: "s-wave", name: "Gentle Wave", category: "semi-formal", className: "lq-border-s-wave" },
  { id: "s-orbit-trace", name: "Orbit Trace", category: "semi-formal", className: "lq-border-s-orbit-trace" },
  { id: "s-focus-brackets", name: "Focus Brackets", category: "semi-formal", className: "lq-border-s-focus-brackets" },

  // --- INFORMAL / CASUAL (12) ---
  { id: "i-sparkle-v2", name: "Sparkle Shine", category: "informal", className: "lq-border-i-sparkle-v2" },
  { id: "i-fire", name: "Energy Flame", category: "informal", className: "lq-border-i-fire" },
  { id: "i-floating-icons", name: "Floating Orbs", category: "informal", className: "lq-border-i-floating-icons" },
  { id: "i-neon-flicker", name: "Neon Flicker", category: "informal", className: "lq-border-i-neon-flicker" },
  { id: "i-glitch", name: "Digital Glitch", category: "informal", className: "lq-border-i-glitch" },
  { id: "i-rainbow-flow", name: "Rainbow Flow", category: "informal", className: "lq-border-i-rainbow-flow" },
  { id: "i-particle-snow-v2", name: "Frost Flow", category: "informal", className: "lq-border-i-particle-snow-v2" },
  { id: "i-cyberpunk", name: "Cyber Matrix", category: "informal", className: "lq-border-i-cyberpunk" },
  { id: "i-comic-pop", name: "Comic Pop", category: "informal", className: "lq-border-i-comic-pop" },
  { id: "i-liquid-motion", name: "Liquid Edge", category: "informal", className: "lq-border-i-liquid-motion" },
  { id: "i-lava-lamp", name: "Lava Lamp", category: "informal", className: "lq-border-i-lava-lamp" },
  { id: "i-plasma", name: "Plasma Sphere", category: "informal", className: "lq-border-i-plasma" },

  // --- ARTISTIC (10) ---
  { id: "a-watercolor", name: "Watercolor Ink", category: "artistic", className: "lq-border-a-watercolor" },
  { id: "a-brush-stroke", name: "Brush Stroke", category: "artistic", className: "lq-border-a-brush-stroke" },
  { id: "a-stained-glass", name: "Stained Glass", category: "artistic", className: "lq-border-a-stained-glass" },
  { id: "a-paper-cut", name: "Paper Cut", category: "artistic", className: "lq-border-a-paper-cut" },
  { id: "a-floral-outline", name: "Floral Trace", category: "artistic", className: "lq-border-a-floral-outline" },
  { id: "a-nebula", name: "Nebula Mist", category: "artistic", className: "lq-border-a-nebula" },
  { id: "a-charcoal", name: "Charcoal Sketch", category: "artistic", className: "lq-border-a-charcoal" },
  { id: "a-mosaic", name: "Crystal Mosaic", category: "artistic", className: "lq-border-a-mosaic" },
  { id: "a-aurora", name: "Aurora Borealis", category: "artistic", className: "lq-border-a-aurora" },
  { id: "a-oil-paint", name: "Oil Texture", category: "artistic", className: "lq-border-a-oil-paint" },

  // --- CYBER / TECH (10) ---
  { id: "c-mainframe", name: "Mainframe HUD", category: "cyber", className: "lq-border-c-mainframe" },
  { id: "c-circuit", name: "Circuit Board", category: "cyber", className: "lq-border-c-circuit" },
  { id: "c-data-stream", name: "Data Stream", category: "cyber", className: "lq-border-c-data-stream" },
  { id: "c-shield-active", name: "Active Shield", category: "cyber", className: "lq-border-c-shield-active" },
  { id: "c-scanning", name: "Retina Scan", category: "cyber", className: "lq-border-c-scanning" },
  { id: "c-quantum", name: "Quantum State", category: "cyber", className: "lq-border-c-quantum" },
  { id: "c-nanotech", name: "Nanotech Mesh", category: "cyber", className: "lq-border-c-nanotech" },
  { id: "c-warp-drive", name: "Warp Drive", category: "cyber", className: "lq-border-c-warp-drive" },
  { id: "c-bios", name: "Legacy BIOS", category: "cyber", className: "lq-border-c-bios" },
  { id: "c-glitch-static", name: "Signal Static", category: "cyber", className: "lq-border-c-glitch-static" },
];
