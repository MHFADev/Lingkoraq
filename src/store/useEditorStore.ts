import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LinkButton } from "@/types";
import { LINK_ICONS } from "@/lib/linkIcons";
import { AVATAR_BORDERS } from "@/lib/avatarBorders";

// ─── Profile State ────────────────────────────────────────────────────────────
export interface ProfileState {
  name: string;
  bio: string;
  avatarUrl: string;
  badgeText: string;
  badgeColor: string; // "green" | "blue" | "purple" | "red" | "none"
  font: string;       // CSS font-family value
  bgType: string;     // "gradient" | "solid" | "mesh" | "image"
  bgValue: string;    // CSS value or image URL
  cardStyle: string;  // "glass" | "solid" | "minimal" | "neon"
  primaryColor: string;
  accentColor: string;
  avatarShape: string; // "circle" | "rounded" | "square"
  avatarSize: string;  // "sm" | "md" | "lg" | "xl"
  avatarGlow: boolean;
  faviconUrl: string;
  showBadge: boolean;
  showStats: boolean;
  statFollowers: string;
  statProjects: string;
  statRating: string;
  musicUrl: string;    // Spotify or YouTube Music embed/share URL
  showMusic: boolean;
  musicPlatform: string; // "spotify" | "youtubemusic"
  countdownDate: string; // ISO date
  showCountdown: boolean;
  scrollAnimation: string; // "none" | "fade" | "slide" | "zoom"
  buttonRadius: string;    // "sm" | "md" | "lg" | "full"
  buttonAnimation: string; // "none" | "lift" | "glow" | "scale"
  showShareBtn: boolean;
  customDomain: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  verifiedBadge: boolean;
  darkMode: boolean;
  cursorEffect: string; // "none" | "glow" | "sparkle"
  pageLayout: string;   // "center" | "left" | "wide"
  avatarBorder: string; // id from AVATAR_BORDERS
  coloredIcons: boolean;
  // ── Custom Border Colors ─────────────────────────────────────
  borderColor1: string;  // primary border color (overrides primaryColor for borders)
  borderColor2: string;  // accent border color
  borderColor3: string;  // third accent (glow, particles)
  borderWidth: number;   // 1–8px padding multiplier
  borderSpeed: string;   // "slow" | "normal" | "fast" | "ultra"
  borderOpacity: number; // 0.3–1.0
  // ── Extra Customization ─────────────────────────────────────
  cardBlur: number;          // backdrop blur 0–40px
  cardOpacity: number;       // card bg opacity 0.02–0.2
  cardBorderRadius: number;  // 8–40px
  cardBorderColor: string;   // card border color
  cardGlow: boolean;         // card outer glow
  cardGlowColor: string;     // card glow color
  bioFontSize: number;       // 12–18px
  nameFontSize: number;      // 18–36px
  linkSpacing: number;       // gap between links 4–20px
  linkHeight: number;        // padding 8–20px
  particleBg: string;        // "none"|"dots"|"grid"|"stars"|"bubbles"|"matrix"
  showNote: boolean;         // Instagram-style note
  noteText: string;
  noteMusicId: string;       // Music ID attached to note
  noteMusicTitle: string;    // Music title for display
  noteMusicArtist: string;   // Music artist for display
  noteMusicThumbnail: string; // Music thumbnail URL
}

export interface EditorStore extends ProfileState {
  // Code
  html: string;
  css: string;
  js: string;
  // Editor UI
  device: "mobile" | "tablet" | "desktop";
  zoom: number;
  showPreview: boolean;
  previewKey: number;
  // Project
  projectId: string | null;
  slug: string;
  title: string;
  isSaving: boolean;
  lastSaved: Date | null;
  selectedElementId: string | null;
  // Links
  links: LinkButton[];
  // History (undo/redo)
  htmlHistory: string[];
  htmlFuture: string[];
  cssHistory: string[];
  cssFuture: string[];

  // Actions
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJs: (js: string) => void;
  undoHtml: () => void;
  redoHtml: () => void;
  undoCss: () => void;
  redoCss: () => void;
  setDevice: (d: "mobile" | "tablet" | "desktop") => void;
  setZoom: (z: number) => void;
  togglePreview: () => void;
  triggerPreview: () => void;
  setProjectId: (id: string | null) => void;
  setSlug: (s: string) => void;
  setTitle: (t: string) => void;
  setIsSaving: (b: boolean) => void;
  setLastSaved: (d: Date | null) => void;
  setSelectedElementId: (id: string | null) => void;
  // Profile actions
  updateProfile: (changes: Partial<ProfileState>) => void;
  // Links
  addLink: (link: Omit<LinkButton, "id">) => void;
  updateLink: (id: string, changes: Partial<LinkButton>) => void;
  removeLink: (id: string) => void;
  reorderLinks: (links: LinkButton[]) => void;
  // Core sync — FIXED
  rebuildHtml: () => void;
  loadProject: (p: { html_code: string; css_code: string; js_code: string; id: string; slug: string; title: string }) => void;
  resetEditor: () => void;
}

let _idCounter = 0;
function uid() { return `lq${Date.now()}${_idCounter++}`; }

// ─── Build HTML from profile + links state ────────────────────────────────────
function buildFullHtml(profile: ProfileState, links: LinkButton[]): string {
  const icon = (iconId: string) => {
    const found = LINK_ICONS.find(i => i.id === iconId);
    if (!found) return "";
    const color = profile.coloredIcons ? (["#000000","#010101","#181717"].includes(found.color) ? "rgba(255,255,255,0.8)" : found.color) : "currentColor";
    return `<svg class="lq-btn-icon" style="color:${color}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${found.svg}</svg>`;
  };

  const visibleLinks = links.filter(l => l.visible);

  const linksHtml = visibleLinks.map(l =>
    `    <a href="${l.url}" class="lq-btn lq-btn-${l.style}" target="_blank" rel="noopener noreferrer">${icon(l.iconId)}<span>${l.label}</span></a>`
  ).join("\n");

  const badgeHtml = profile.showBadge && profile.badgeText ? `
    <div class="lq-badge lq-badge-${profile.badgeColor}">
      <span class="lq-badge-dot"></span>${profile.badgeText}
    </div>` : "";

  const statsHtml = profile.showStats ? `
    <div class="lq-stats">
      <div class="lq-stat"><span class="lq-stat-n">${profile.statFollowers}</span><span class="lq-stat-l">Followers</span></div>
      <div class="lq-stat-div"></div>
      <div class="lq-stat"><span class="lq-stat-n">${profile.statProjects}</span><span class="lq-stat-l">Projects</span></div>
      <div class="lq-stat-div"></div>
      <div class="lq-stat"><span class="lq-stat-n">${profile.statRating}</span><span class="lq-stat-l">Rating</span></div>
    </div>` : "";

  // ── Build music embed HTML ─────────────────────────────────────
  function getMusicEmbedSrc(platform: string, url: string): string {
    if (!url) return "";
    if (platform === "youtubemusic") {
      // Accept: YouTube Music share URL or regular YouTube URL
      const ytMatch = url.match(/(?:v=|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/);
      if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
      }
      return url; // fallback: use as-is
    }
    // Spotify: extract track ID to ensure clean embed without ?si= query params that cause 404
    const spotifyMatch = url.match(/track\/([a-zA-Z0-9]+)/);
    if (spotifyMatch) {
      return `https://open.spotify.com/embed/track/${spotifyMatch[1]}?utm_source=generator`;
    }
    if (!url.includes("/embed/")) {
      return url.replace("open.spotify.com/", "open.spotify.com/embed/");
    }
    return url;
  }

  const musicEmbedSrc = getMusicEmbedSrc(profile.musicPlatform || "spotify", profile.musicUrl);
  const isYtMusic = (profile.musicPlatform || "spotify") === "youtubemusic";
  let ytVideoId = "";
  if (isYtMusic && profile.musicUrl) {
    const ytMatch = profile.musicUrl.match(/(?:v=|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/);
    if (ytMatch) ytVideoId = ytMatch[1];
  }

  // Platform branding helpers
  const musicPlatformLabel = isYtMusic ? "YouTube Music" : "Spotify";
  const musicPlatformColor = isYtMusic ? "#FF0000" : "#1DB954";
  const musicPlatformColorDim = isYtMusic ? "rgba(255,0,0,0.12)" : "rgba(29,185,84,0.12)";
  const musicPlatformColorBorder = isYtMusic ? "rgba(255,0,0,0.25)" : "rgba(29,185,84,0.25)";
  const musicPlatformIcon = isYtMusic
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="${musicPlatformColor}" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="${musicPlatformColor}" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;

  let musicHtml = "";
  if (profile.showMusic && profile.musicUrl) {
    if (isYtMusic && ytVideoId) {
      // ── CUSTOM YOUTUBE PLAYER UI ──
      musicHtml = `
      <div class="lq-music-card lq-yt-custom" data-vid="${ytVideoId}" style="
        margin: 12px 0;
        background: linear-gradient(135deg, ${musicPlatformColorDim}, rgba(255,255,255,0.04));
        border: 1px solid ${musicPlatformColorBorder};
        border-radius: 16px;
        overflow: hidden;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.06);
        padding: 14px;
        position: relative;
      ">
        <div style="display: flex; gap: 14px; align-items: center;">
          <div style="position:relative; width: 56px; height: 56px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            <img src="https://img.youtube.com/vi/${ytVideoId}/mqdefault.jpg" style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.3);">
            <div class="yt-cover-overlay" style="position:absolute;inset:0;background:rgba(0,0,0,0.2);"></div>
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
              ${musicPlatformIcon}
              <span class="yt-artist" style="font-size:10px; font-weight:700; color:${musicPlatformColor}; letter-spacing:0.05em; text-transform:uppercase;">YouTube Audio</span>
            </div>
            <div class="yt-title marquee" style="font-weight: 600; font-size: 14px; color: var(--lq-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Memuat Audio...</div>
          </div>
          <button class="yt-play-btn" style="width: 44px; height: 44px; border-radius: 50%; border: none; background: ${musicPlatformColor}; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px ${musicPlatformColor}66; transition: transform 0.2s, box-shadow 0.2s;">
            <svg class="icon-play" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="margin-left:2px;"><path d="M8 5v14l11-7z"/></svg>
            <svg class="icon-pause" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>
        </div>
        <div style="margin-top: 14px; display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--lq-text); opacity: 0.8; font-variant-numeric: tabular-nums;">
          <span class="yt-time-current">0:00</span>
          <div class="yt-progress-container" style="flex: 1; height: 16px; display: flex; align-items: center; cursor: pointer; position: relative;">
             <div class="yt-progress-bg" style="width: 100%; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; position: relative; overflow: hidden;">
                <div class="yt-progress-bar" style="width: 0%; height: 100%; background: ${musicPlatformColor}; border-radius: 2px;"></div>
             </div>
          </div>
          <span class="yt-time-total">0:00</span>
        </div>
        <div id="yt-player-target-${ytVideoId}" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none;"></div>
      </div>
      <style>
        .yt-play-btn:hover { transform: scale(1.05); box-shadow: 0 6px 16px ${musicPlatformColor}88; }
        .yt-play-btn:active { transform: scale(0.95); }
        .yt-progress-container:hover .yt-progress-bg { height: 6px; }
      </style>
      `;
    } else {
      // ── STANDARD SPOTIFY EMBED (Compact 80px) ──
      musicHtml = `
      <div class="lq-music-card" style="
        margin: 12px 0;
        background: linear-gradient(135deg, ${musicPlatformColorDim}, rgba(255,255,255,0.04));
        border: 1px solid ${musicPlatformColorBorder};
        border-radius: 16px;
        overflow: hidden;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.06);
      ">
        <div class="lq-music-header" style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px 0 14px;
        ">
          ${musicPlatformIcon}
          <span style="
            font-size: 11px;
            font-weight: 600;
            color: ${musicPlatformColor};
            letter-spacing: 0.05em;
            text-transform: uppercase;
            opacity: 0.9;
          ">${musicPlatformLabel}</span>
          <span style="
            margin-left: auto;
            width: 6px; height: 6px;
            border-radius: 50%;
            background: ${musicPlatformColor};
            box-shadow: 0 0 6px ${musicPlatformColor};
            animation: lqMusicPulse 2s ease-in-out infinite;
          "></span>
        </div>
        <div style="padding: 10px 10px 10px 10px; border-radius: 0 0 16px 16px; overflow: hidden;">
          <iframe
            src="${musicEmbedSrc}"
            width="100%"
            height="80"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowfullscreen
            loading="lazy"
            style="border-radius: 10px; display: block;"
          ></iframe>
        </div>
      </div>
      <style>
        @keyframes lqMusicPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.75); }
        }
      </style>`;
    }
  }

  const countdownHtml = profile.showCountdown && profile.countdownDate ? `
    <div class="lq-countdown" id="lq-countdown" data-date="${profile.countdownDate}">
      <div class="lq-cd-item"><span class="lq-cd-n" id="lq-cd-d">00</span><span class="lq-cd-l">Days</span></div>
      <div class="lq-cd-item"><span class="lq-cd-n" id="lq-cd-h">00</span><span class="lq-cd-l">Hrs</span></div>
      <div class="lq-cd-item"><span class="lq-cd-n" id="lq-cd-m">00</span><span class="lq-cd-l">Min</span></div>
      <div class="lq-cd-item"><span class="lq-cd-n" id="lq-cd-s">00</span><span class="lq-cd-l">Sec</span></div>
    </div>` : "";

  const shareHtml = profile.showShareBtn ? `
    <button class="lq-share-btn" id="lq-share-btn">
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
      <span id="lq-share-text">Share</span>
    </button>` : "";

  const avatarSizeMap: Record<string,string> = { sm:"70px", md:"90px", lg:"110px", xl:"130px" };
  const avatarPx = avatarSizeMap[profile.avatarSize] || "100px";
  const avatarRadius = profile.avatarShape === "circle" ? "50%" : profile.avatarShape === "rounded" ? "20px" : "8px";
  const border = AVATAR_BORDERS.find(b => b.id === profile.avatarBorder);
  const borderClass = border ? border.className : "";

  const cursorGlowHtml = profile.cursorEffect === "glow" ? `<div id="lq-cursor-glow"></div>` : "";

  const noteHtml = profile.showNote && (profile.noteText || profile.noteMusicId) ? `
    <div class="lq-note-bubble" style="
      position: absolute;
      top: -10px;
      right: -20px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 12px;
      border-radius: 16px 16px 16px 4px;
      color: #fff;
      font-size: 11px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10;
      max-width: 160px;
      word-wrap: break-word;
      animation: lqNotePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    ">
      ${profile.noteText ? `<div style="margin-bottom: ${profile.noteMusicId ? '8px' : '0'}">${profile.noteText}</div>` : ''}
      ${profile.noteMusicId ? `
        <div class="lq-note-music" style="
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
        " onclick="playNoteMusic('${profile.noteMusicId}', '${profile.noteMusicTitle.replace(/'/g, "\\'")}', '${profile.noteMusicArtist.replace(/'/g, "\\'")}')">
          <div style="width: 24px; height: 24px; border-radius: 4px; overflow: hidden; flex-shrink: 0;">
            <img src="${profile.noteMusicThumbnail}" alt="${profile.noteMusicTitle}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 10px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${profile.noteMusicTitle}</div>
            <div style="font-size: 9px; color: rgba(255,255,255,0.6); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${profile.noteMusicArtist}</div>
          </div>
          <div style="width: 16px; height: 16px; background: #6366f1; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <script>
          function playNoteMusic(videoId, title, artist) {
            // Check if there's an existing music player
            const existingPlayer = document.querySelector('.lq-music-card[data-vid="' + videoId + '"]');
            if (existingPlayer) {
              const playBtn = existingPlayer.querySelector('.yt-play-btn');
              if (playBtn) playBtn.click();
              return;
            }
            
            // Create a temporary music player
            const tempPlayer = document.createElement('div');
            tempPlayer.className = 'lq-music-card lq-yt-custom';
            tempPlayer.setAttribute('data-vid', videoId);
            tempPlayer.style.cssText = 'margin: 12px 0; background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(255,255,255,0.04)); border: 1px solid rgba(99,102,241,0.25); border-radius: 16px; overflow: hidden; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-shadow: 0 4px 24px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.06); padding: 14px; position: relative;';
            
            tempPlayer.innerHTML = \`
              <div style="display: flex; gap: 14px; align-items: center;">
                <div style="position:relative; width: 56px; height: 56px; border-radius: 10px; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                  <img src="https://img.youtube.com/vi/\${videoId}/mqdefault.jpg" style="width: 100%; height: 100%; object-fit: cover; transform: scale(1.3);">
                  <div style="position:absolute;inset:0;background:rgba(0,0,0,0.2);"></div>
                </div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#6366f1" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span style="font-size:10px; font-weight:700; color:#6366f1; letter-spacing:0.05em; text-transform:uppercase;">Note Music</span>
                  </div>
                  <div class="yt-title marquee" style="font-weight: 600; font-size: 14px; color: var(--lq-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${title}</div>
                </div>
                <button class="yt-play-btn" style="width: 44px; height: 44px; border-radius: 50%; border: none; background: #6366f1; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 4px 12px #6366f166; transition: transform 0.2s, box-shadow 0.2s;">
                  <svg class="icon-play" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="margin-left:2px;"><path d="M8 5v14l11-7z"/></svg>
                  <svg class="icon-pause" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                </button>
              </div>
              <div style="margin-top: 14px; display: flex; align-items: center; gap: 10px; font-size: 11px; color: var(--lq-text); opacity: 0.8; font-variant-numeric: tabular-nums;">
                <span class="yt-time-current">0:00</span>
                <div class="yt-progress-container" style="flex: 1; height: 16px; display: flex; align-items: center; cursor: pointer; position: relative;">
                   <div class="yt-progress-bg" style="width: 100%; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; position: relative; overflow: hidden;">
                      <div class="yt-progress-bar" style="width: 0%; height: 100%; background: #6366f1; border-radius: 2px;"></div>
                   </div>
                </div>
                <span class="yt-time-total">0:00</span>
              </div>
              <div id="yt-player-target-\${videoId}" style="position:absolute; width:1px; height:1px; opacity:0; pointer-events:none;"></div>
            \`;
            
            // Insert after the note bubble
            const noteBubble = document.querySelector('.lq-note-bubble');
            if (noteBubble && noteBubble.parentNode) {
              noteBubble.parentNode.insertBefore(tempPlayer, noteBubble.nextSibling);
            }
            
            // Load YouTube API if not already loaded
            if (!window.YT) {
              const tag = document.createElement('script');
              tag.src = 'https://www.youtube.com/iframe_api';
              const firstScriptTag = document.getElementsByTagName('script')[0];
              firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
            
            // Wait for API to load
            const checkYT = setInterval(() => {
              if (window.YT && window.YT.Player) {
                clearInterval(checkYT);
                const player = new YT.Player('yt-player-target-' + videoId, {
                  height: '1',
                  width: '1',
                  videoId: videoId,
                  playerVars: { 'autoplay': 0, 'controls': 0, 'disablekb': 1, 'fs': 0, 'rel': 0, 'playsinline': 1 },
                  events: {
                    'onReady': function(event) {
                      const playBtn = tempPlayer.querySelector('.yt-play-btn');
                      if (playBtn) {
                        playBtn.addEventListener('click', function() {
                          if (player.getPlayerState() === YT.PlayerState.PLAYING) {
                            player.pauseVideo();
                          } else {
                            player.playVideo();
                          }
                        });
                      }
                    },
                    'onStateChange': function(event) {
                      const iconPlay = tempPlayer.querySelector('.icon-play');
                      const iconPause = tempPlayer.querySelector('.icon-pause');
                      if (event.data == YT.PlayerState.PLAYING) {
                        if(iconPlay) iconPlay.style.display = 'none';
                        if(iconPause) iconPause.style.display = 'block';
                      } else {
                        if(iconPlay) iconPlay.style.display = 'block';
                        if(iconPause) iconPause.style.display = 'none';
                      }
                    }
                  }
                });
              }
            }, 100);
          }
        </script>
      ` : ''}
    </div>
    <style>
      @keyframes lqNotePop {
        0% { transform: scale(0.5) translateY(10px); opacity: 0; }
        100% { transform: scale(1) translateY(0); opacity: 1; }
      }
      .lq-note-music:hover {
        background: rgba(255,255,255,0.08) !important;
        border-color: rgba(255,255,255,0.15) !important;
      }
    </style>
  ` : "";

  return `<div class="lq-page lq-layout-${profile.pageLayout}">
  ${cursorGlowHtml}
  <div class="lq-orbs" aria-hidden="true"><div class="lq-orb lq-orb1"></div><div class="lq-orb lq-orb2"></div></div>
  <div class="lq-card lq-card-${profile.cardStyle}">
    <div class="lq-avatar-wrapper ${borderClass}">
      ${noteHtml}
      <div class="lq-avatar-ring${profile.avatarGlow ? " lq-avatar-glow" : ""}">
        <img src="${profile.avatarUrl}" class="lq-avatar" alt="${profile.name}" style="width:${avatarPx};height:${avatarPx};border-radius:${avatarRadius};"/>
      </div>
    </div>${badgeHtml}
    <h1 class="lq-name">${profile.name}${profile.verifiedBadge ? `<svg class="lq-verified" viewBox="0 0 24 24" fill="#6366f1" width="20" height="20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` : ""}</h1>
    <p class="lq-bio">${profile.bio}</p>${statsHtml}${musicHtml}${countdownHtml}
    <div class="lq-links" id="lq-links-container">
${linksHtml}
    </div>${shareHtml}
  </div>
</div>`;
}

function buildParticleBg(type: string, color: string): string {
  const c = color;
  const cm = `color-mix(in srgb,${c} 25%,transparent)`;
  const patterns: Record<string, string> = {
    dots: `
.lq-page::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(circle,${cm} 1px,transparent 1px);
  background-size:28px 28px;opacity:.4;}`,
    grid: `
.lq-page::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:linear-gradient(${cm} 1px,transparent 1px),linear-gradient(90deg,${cm} 1px,transparent 1px);
  background-size:40px 40px;opacity:.25;}`,
    stars: `
.lq-page::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:radial-gradient(circle,rgba(255,255,255,.8) 1px,transparent 1px),
    radial-gradient(circle,rgba(255,255,255,.5) 1px,transparent 1px),
    radial-gradient(circle,rgba(255,255,255,.3) 2px,transparent 2px);
  background-size:80px 80px,120px 120px,200px 200px;
  background-position:0 0,40px 60px,70px 30px;
  animation:lqStarsTwinkle 8s ease-in-out infinite;opacity:.6;}
@keyframes lqStarsTwinkle{0%,100%{opacity:.6}50%{opacity:.3}}`,
    bubbles: `
.lq-page::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
.lq-page::after{content:"";position:fixed;
  width:8px;height:8px;border-radius:50%;
  background:${cm};
  box-shadow:20px 80vh ${cm},60px 60vh color-mix(in srgb,${c} 15%,transparent),
    100px 90vh ${cm},140px 70vh color-mix(in srgb,${c} 20%,transparent),
    180px 50vh ${cm},220px 85vh color-mix(in srgb,${c} 15%,transparent),
    260px 40vh ${cm},300px 75vh color-mix(in srgb,${c} 20%,transparent),
    340px 65vh ${cm},380px 55vh color-mix(in srgb,${c} 15%,transparent);
  animation:lqBubbleRise 12s linear infinite;
  pointer-events:none;z-index:0;bottom:-10px;left:0;}
@keyframes lqBubbleRise{0%{transform:translateY(0);opacity:.7}100%{transform:translateY(-110vh);opacity:0}}`,
    matrix: `
.lq-page::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;
  background:repeating-linear-gradient(0deg,
    transparent,transparent 28px,
    color-mix(in srgb,${c} 8%,transparent) 28px,
    color-mix(in srgb,${c} 8%,transparent) 29px);
  animation:lqMatrixDrop 20s linear infinite;opacity:.5;}
@keyframes lqMatrixDrop{0%{background-position:0 0}100%{background-position:0 200px}}`,
  };
  return patterns[type] || '';
}

function buildBorderCss(profile: ProfileState): string {
  const b1 = profile.borderColor1 || profile.primaryColor;
  const b2 = profile.borderColor2 || profile.accentColor;
  const b3 = profile.borderColor3 || "#ec4899";
  const speedMap: Record<string, string> = { slow: "6s", normal: "3s", fast: "1.5s", ultra: "0.5s" };
  const sp = speedMap[profile.borderSpeed] || "3s";
  const spH = speedMap[profile.borderSpeed] ? String(parseFloat(speedMap[profile.borderSpeed]) / 2) + "s" : "1.5s";
  const spD = speedMap[profile.borderSpeed] ? String(parseFloat(speedMap[profile.borderSpeed]) * 1.5) + "s" : "4.5s";
  const pw = Math.max(1, Math.min(8, profile.borderWidth || 4));
  const op = profile.borderOpacity ?? 1;

  return `
/* ═══ BORDER SYSTEM V4 — ULTRA PREMIUM ═══ */
/* Custom vars */
:root { --b1:${b1}; --b2:${b2}; --b3:${b3}; --bw:${pw}px; --bop:${op}; --bsp:${sp}; }

/* Shared keyframes */
@keyframes lqSpin    { to{transform:rotate(360deg)} }
@keyframes lqSpinR   { to{transform:rotate(-360deg)} }
@keyframes lqFadeOut { 0%{opacity:${op};transform:scale(1)} 100%{opacity:0;transform:scale(2)} }
@keyframes lqMorphB  { 0%,100%{border-radius:62% 38% 46% 54%/60% 44% 56% 40%} 33%{border-radius:42% 58% 65% 35%/48% 62% 38% 52%} 66%{border-radius:55% 45% 35% 65%/68% 32% 68% 32%} }
@keyframes lqHueB    { to{filter:hue-rotate(360deg)} }
@keyframes lqShimB   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes lqPulseB  { 0%,100%{transform:scale(1);opacity:${op}} 50%{transform:scale(1.06);opacity:${Math.min(1,op*0.7)}} }
@keyframes lqFloatB  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes lqBlinkB  { 0%,100%{opacity:${op}} 49%{opacity:${op}} 50%{opacity:0} 99%{opacity:0} }

/* ── FORMAL ──────────────────────────────────────────────────── */

/* 1. Classic Thin — shimmer sweep + subtle glow ring */
.lq-border-f-solid-thin .lq-avatar-ring {
  padding: ${pw}px;
  background: linear-gradient(90deg, color-mix(in srgb,${b1} 20%,transparent), ${b1}, ${b2}, ${b1}, color-mix(in srgb,${b1} 20%,transparent));
  background-size: 300% 100%;
  animation: lqShimB ${sp} linear infinite;
  box-shadow: 0 0 ${pw * 4}px color-mix(in srgb,${b1} ${Math.round(op*40)}%,transparent);
  opacity: ${op};
}
.lq-border-f-solid-thin .lq-avatar-ring::before {
  content:""; position:absolute; inset:-${pw * 2}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b1} 30%,transparent);
  animation: lqFadeOut ${spD} ease-out infinite;
}

/* 2. Classic Thick — tri-color breathe + rotating arc */
.lq-border-f-solid-thick .lq-avatar-ring {
  padding: ${pw + 2}px;
  background: linear-gradient(135deg,${b1},${b2},${b3},${b2},${b1});
  background-size: 300% 300%;
  animation: lqShimB ${spD} ease-in-out infinite, lqPulseB ${sp} ease-in-out infinite;
  box-shadow: 0 0 ${pw * 6}px color-mix(in srgb,${b1} 50%,transparent), 0 ${pw * 3}px ${pw * 8}px rgba(0,0,0,0.4);
  opacity: ${op};
}
.lq-border-f-solid-thick .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg, rgba(255,255,255,0.3) 0deg 20deg, transparent 20deg 180deg, rgba(255,255,255,0.2) 180deg 200deg, transparent 200deg 360deg);
  animation: lqSpin ${sp} linear infinite;
}

/* 3. Double Line — multi-ring cascade */
.lq-border-f-double .lq-avatar-ring {
  box-shadow: 0 0 0 ${pw - 1}px ${b1}, 0 0 0 ${pw + 2}px color-mix(in srgb,${b1} 15%,transparent), 0 0 0 ${pw + 4}px ${b2}, 0 0 ${pw * 5}px color-mix(in srgb,${b2} 40%,transparent);
  animation: lq-f-double-v4 ${sp} ease-in-out infinite;
  opacity: ${op};
}
.lq-border-f-double .lq-avatar-ring::before {
  content:""; position:absolute; inset:-${pw * 3}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b3} 25%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .4s;
}
.lq-border-f-double .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw * 6}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b1} 15%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .9s;
}
@keyframes lq-f-double-v4 {
  0%,100%{ box-shadow:0 0 0 ${pw-1}px ${b1},0 0 0 ${pw+2}px color-mix(in srgb,${b1} 15%,transparent),0 0 0 ${pw+4}px ${b2},0 0 ${pw*5}px color-mix(in srgb,${b2} 35%,transparent); }
  50%    { box-shadow:0 0 0 ${pw-1}px ${b2},0 0 0 ${pw+4}px color-mix(in srgb,${b2} 10%,transparent),0 0 0 ${pw+8}px ${b3},0 0 ${pw*8}px color-mix(in srgb,${b3} 50%,transparent); }
}

/* 4. Subtle Glow — 3-wave expanding rings + shimmer */
.lq-border-f-glow-subtle .lq-avatar-ring {
  box-shadow: 0 0 0 2px ${b1}, 0 0 ${pw*5}px color-mix(in srgb,${b1} 55%,transparent), 0 0 ${pw*12}px color-mix(in srgb,${b1} 20%,transparent);
  animation: lq-f-glow-v4 ${sp} ease-in-out infinite;
  opacity: ${op};
}
.lq-border-f-glow-subtle .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:1px solid color-mix(in srgb,${b2} 50%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .5s;
}
.lq-border-f-glow-subtle .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:1px solid color-mix(in srgb,${b3} 30%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite 1s;
}
@keyframes lq-f-glow-v4 {
  0%,100%{ box-shadow:0 0 0 2px ${b1},0 0 ${pw*5}px color-mix(in srgb,${b1} 55%,transparent); }
  33%    { box-shadow:0 0 0 2px ${b2},0 0 ${pw*8}px color-mix(in srgb,${b2} 70%,transparent); }
  66%    { box-shadow:0 0 0 2px ${b3},0 0 ${pw*6}px color-mix(in srgb,${b3} 60%,transparent); }
}

/* 5. Elegant Gold — shimmer + rotating sparkle arc */
.lq-border-f-elegant-gold .lq-avatar-ring {
  background: linear-gradient(135deg,#bf953f,#fcf6ba,#b38728,#fbf5b7,#aa771c);
  background-size: 300% 300%;
  padding: ${pw}px;
  animation: lqShimB ${sp} ease-in-out infinite;
  box-shadow: 0 0 ${pw*6}px rgba(201,168,76,0.6), inset 0 1px 0 rgba(255,255,220,0.7);
  opacity: ${op};
}
.lq-border-f-elegant-gold .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,transparent 0deg 70deg,rgba(255,255,210,.9) 70deg 90deg,transparent 90deg 250deg,rgba(255,255,210,.6) 250deg 270deg,transparent 270deg 360deg);
  animation: lqSpin ${spD} linear infinite;
  filter: drop-shadow(0 0 3px rgba(255,255,150,.8));
}
.lq-border-f-elegant-gold .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(255,220,100,0.2);
  animation: lqFadeOut ${sp} ease-out infinite .6s;
}

/* 6. Inset Shadow — deep vignette + rotating gradient */
.lq-border-f-inset .lq-avatar-ring {
  background: linear-gradient(135deg,color-mix(in srgb,${b1} 25%,#0a0a1a),#0d0d20);
  padding: ${pw + 1}px;
  opacity: ${op};
}
.lq-border-f-inset .lq-avatar {
  box-shadow: inset 0 0 0 3px color-mix(in srgb,${b1} 60%,transparent), inset 0 0 25px rgba(0,0,0,0.7), inset 0 1px 2px color-mix(in srgb,${b1} 30%,transparent);
}
.lq-border-f-inset .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: linear-gradient(135deg,color-mix(in srgb,${b1} 30%,transparent) 0%,transparent 50%);
  animation: lqSpin ${spD} linear infinite;
}
.lq-border-f-inset .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b2} 15%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite;
}

/* 7. Slow Pulse — 4 concentric ring waves */
.lq-border-f-pulse-slow .lq-avatar-ring {
  box-shadow: 0 0 0 ${pw-1}px ${b1};
  animation: lqPulseB ${sp} ease-in-out infinite;
  opacity: ${op};
}
.lq-border-f-pulse-slow .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:2px solid color-mix(in srgb,${b1} 60%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .3s;
}
.lq-border-f-pulse-slow .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:1px solid color-mix(in srgb,${b2} 35%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .7s;
}

/* 8. Minimal Dots — orbiting particle + dashed counter-rotate */
.lq-border-f-minimal-dots .lq-avatar-ring {
  outline: 2px dashed color-mix(in srgb,${b1} 60%,transparent);
  outline-offset: ${pw + 1}px;
  animation: lqSpinR ${spD} linear infinite;
  opacity: ${op};
}
.lq-border-f-minimal-dots .lq-avatar-ring::before {
  content:""; position:absolute; border-radius:50%;
  width:${pw + 6}px; height:${pw + 6}px;
  background:${b1};
  inset:unset; top:-${pw + 3}px; left:calc(50% - ${Math.round((pw+6)/2)}px);
  box-shadow:0 0 ${pw*3}px ${pw}px color-mix(in srgb,${b1} 80%,transparent);
  animation: lqSpin ${sp} linear infinite;
}
.lq-border-f-minimal-dots .lq-avatar-ring::after {
  content:""; position:absolute; border-radius:50%;
  width:${pw + 4}px; height:${pw + 4}px;
  background:${b3};
  inset:unset; bottom:-${pw + 2}px; left:calc(50% - ${Math.round((pw+4)/2)}px);
  box-shadow:0 0 ${pw*2}px ${pw}px color-mix(in srgb,${b3} 70%,transparent);
  animation: lqSpinR ${sp} linear infinite;
}
.lq-border-f-minimal-dots .lq-avatar { animation: lqSpin ${spD} linear infinite; }

/* 9. Corporate Blue — flowing authority gradient */
.lq-border-f-corporate .lq-avatar-ring {
  background: linear-gradient(180deg,#1e3a8a,#3b82f6,#60a5fa,#3b82f6,#1e3a8a);
  background-size: 100% 400%;
  padding: ${pw}px;
  animation: lq-f-corp-v4 ${spD} ease-in-out infinite;
  box-shadow: 0 ${pw*3}px ${pw*6}px rgba(30,58,138,0.5), inset 0 1px 0 rgba(96,165,250,0.4);
  opacity: ${op};
}
.lq-border-f-corporate .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(96,165,250,0.3) 0deg 10deg,transparent 10deg 350deg,rgba(96,165,250,0.2) 350deg 360deg);
  animation: lqSpin ${sp} linear infinite;
}
@keyframes lq-f-corp-v4 { 0%,100%{background-position:0% 0%} 50%{background-position:0% 100%} }

/* 10. Silver Silk — metallic shimmer + sparkle highlight arc */
.lq-border-f-silver-silk .lq-avatar-ring {
  background: linear-gradient(135deg,#c0c0c0,#ffffff,#a0a0a0,#ffffff,#c0c0c0);
  background-size: 400% 400%;
  padding: ${pw}px;
  animation: lqShimB ${spD} ease-in-out infinite;
  box-shadow: 0 ${pw*2}px ${pw*5}px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.1);
  opacity: ${op};
}
.lq-border-f-silver-silk .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,transparent 0deg 150deg,rgba(255,255,255,0.8) 150deg 210deg,transparent 210deg 360deg);
  animation: lqSpin ${spD} linear infinite;
  filter: blur(1px);
}
.lq-border-f-silver-silk .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw}px; border-radius:50%;
  border:1px solid rgba(255,255,255,0.2);
  animation: lqFadeOut ${spD} ease-out infinite;
}

/* 11. Platinum Edge — luxury 3D bevel + twin shine arcs */
.lq-border-f-platinum .lq-avatar-ring {
  background: linear-gradient(145deg,#f0f0f0,#d0d0d0,#f8f8f8,#b0b0b0,#f0f0f0);
  background-size: 300% 300%;
  padding: ${pw + 1}px;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.95), 0 0 0 2px rgba(150,150,150,0.5), 0 ${pw*3}px ${pw*8}px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.95);
  animation: lqShimB ${spD} ease-in-out infinite;
  opacity: ${op};
}
.lq-border-f-platinum .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: linear-gradient(135deg,rgba(255,255,255,0.7) 0%,transparent 50%);
  animation: lqSpin ${spD} linear infinite;
}
.lq-border-f-platinum .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 180deg,transparent 0deg 160deg,rgba(255,255,255,0.5) 160deg 200deg,transparent 200deg 360deg);
  animation: lqSpinR ${spH} linear infinite;
}

/* ── SEMI-FORMAL ─────────────────────────────────────────────── */

/* 13. Rotating Ring — comet tail with speed control */
.lq-border-s-rotate-gradient .lq-avatar-ring {
  background: conic-gradient(from 0deg,
    ${b1} 0deg 25deg, color-mix(in srgb,${b1} 8%,transparent) 25deg 160deg,
    ${b2} 160deg 185deg, color-mix(in srgb,${b2} 8%,transparent) 185deg 315deg,
    ${b3} 315deg 340deg, color-mix(in srgb,${b3} 8%,transparent) 340deg 360deg);
  padding: ${pw}px;
  animation: lqSpin ${sp} linear infinite;
  box-shadow: 0 0 ${pw*6}px color-mix(in srgb,${b1} 55%,transparent);
  opacity: ${op};
}
.lq-border-s-rotate-gradient .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 180deg,transparent 0deg 150deg,rgba(255,255,255,0.3) 150deg 210deg,transparent 210deg 360deg);
  animation: lqSpin ${sp} linear infinite;
}
.lq-border-s-rotate-gradient .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b1} 20%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .3s;
}

/* 14. Dual Spinner — counter-rotating bounce arcs */
.lq-border-s-dual-spin .lq-avatar-ring { padding:${pw}px; opacity:${op}; }
.lq-border-s-dual-spin .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent;
  border:${pw-1}px solid transparent;
  border-top-color:${b1}; border-right-color:${b1};
  animation: lqSpin ${sp} cubic-bezier(.68,-.55,.27,1.55) infinite;
  box-shadow: 0 0 ${pw*3}px color-mix(in srgb,${b1} 70%,transparent);
}
.lq-border-s-dual-spin .lq-avatar-ring::after {
  content:""; position:absolute; inset:${pw}px; border-radius:50%;
  background:transparent;
  border:${pw-1}px solid transparent;
  border-bottom-color:${b2}; border-left-color:${b2};
  animation: lqSpinR ${spH} cubic-bezier(.68,-.55,.27,1.55) infinite;
  box-shadow: 0 0 ${pw*3}px color-mix(in srgb,${b2} 70%,transparent);
}

/* 15. Soft Ripple — 3 expanding colour rings */
.lq-border-s-ripple .lq-avatar-ring { box-shadow:0 0 0 ${pw-1}px ${b1}; opacity:${op}; }
.lq-border-s-ripple .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:${pw-1}px solid color-mix(in srgb,${b1} 60%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite;
}
.lq-border-s-ripple .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:1px solid color-mix(in srgb,${b2} 40%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .8s;
}

/* 16. Dashed Spin — dual dashed counter-rotate */
.lq-border-s-dash-spin .lq-avatar-ring {
  outline:${pw-1}px dashed color-mix(in srgb,${b1} 80%,transparent);
  outline-offset:${pw+2}px;
  animation: lqSpin ${spD} linear infinite;
  opacity:${op};
}
.lq-border-s-dash-spin .lq-avatar-ring::before {
  content:""; position:absolute; inset:-${pw*3}px; border-radius:50%;
  border:1px dashed color-mix(in srgb,${b2} 50%,transparent);
  background:transparent;
  animation: lqSpinR ${spD} linear infinite;
}
.lq-border-s-dash-spin .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*6}px; border-radius:50%;
  border:1px dotted color-mix(in srgb,${b3} 30%,transparent);
  background:transparent;
  animation: lqSpin calc(${spD} * 1.5) linear infinite;
}

/* 17. Corner Accents — animated bracket sweep */
.lq-border-s-corner-blink .lq-avatar-ring { animation: lqFloatB ${sp} ease-in-out infinite; opacity:${op}; }
.lq-border-s-corner-blink .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent;
  border:${pw}px solid transparent;
  border-top-color:${b1}; border-right-color:${b1};
  animation: lqSpin ${sp} cubic-bezier(.4,0,.2,1) infinite;
  box-shadow:2px -2px ${pw*3}px color-mix(in srgb,${b1} 70%,transparent);
}
.lq-border-s-corner-blink .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent;
  border:${pw}px solid transparent;
  border-bottom-color:${b3}; border-left-color:${b3};
  animation: lqSpinR calc(${sp} * 1.2) cubic-bezier(.4,0,.2,1) infinite;
  box-shadow:-2px 2px ${pw*3}px color-mix(in srgb,${b3} 70%,transparent);
}

/* 18. Breathing Glow — 3-color morph expand */
.lq-border-s-breath .lq-avatar-ring {
  box-shadow:0 0 0 ${pw-1}px ${b1},0 0 ${pw*6}px color-mix(in srgb,${b1} 55%,transparent);
  animation: lq-s-breath-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-s-breath .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:1px solid color-mix(in srgb,${b2} 40%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .4s;
}
.lq-border-s-breath .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  border:1px solid color-mix(in srgb,${b3} 25%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite .8s;
}
@keyframes lq-s-breath-v4 {
  0%,100%{ box-shadow:0 0 0 ${pw-1}px ${b1},0 0 ${pw*6}px color-mix(in srgb,${b1} 55%,transparent); transform:scale(1); }
  33%    { box-shadow:0 0 0 ${pw-1}px ${b2},0 0 ${pw*9}px color-mix(in srgb,${b2} 70%,transparent); transform:scale(1.02); }
  66%    { box-shadow:0 0 0 ${pw-1}px ${b3},0 0 ${pw*7}px color-mix(in srgb,${b3} 60%,transparent); transform:scale(0.99); }
}

/* 19. Glass Ring — frosted 3D depth */
.lq-border-s-glass-ring .lq-avatar-ring {
  background: linear-gradient(135deg,color-mix(in srgb,#fff 18%,transparent),color-mix(in srgb,#fff 4%,transparent));
  backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  padding:${pw + 2}px;
  box-shadow:0 0 0 1px rgba(255,255,255,0.3),inset 0 1px 0 rgba(255,255,255,0.5),0 ${pw*3}px ${pw*10}px rgba(0,0,0,0.5);
  opacity:${op};
}
.lq-border-s-glass-ring .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: linear-gradient(135deg,rgba(255,255,255,0.35) 0%,transparent 60%);
  animation: lqSpin ${spD} linear infinite;
}
.lq-border-s-glass-ring .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw}px; border-radius:50%;
  border:1px solid rgba(255,255,255,0.15);
  animation: lqFadeOut ${spD} ease-out infinite;
}

/* 20. Geometric Path — conic 8-segment pulse */
.lq-border-s-geometric .lq-avatar-ring { padding:${pw-1}px; background:transparent; opacity:${op}; }
.lq-border-s-geometric .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,
    ${b1} 0deg 40deg,transparent 40deg 90deg,
    ${b2} 90deg 130deg,transparent 130deg 180deg,
    ${b3} 180deg 220deg,transparent 220deg 270deg,
    ${b1} 270deg 310deg,transparent 310deg 360deg);
  animation: lqSpin ${sp} linear infinite;
  filter:drop-shadow(0 0 ${pw}px color-mix(in srgb,${b1} 60%,transparent));
}
.lq-border-s-geometric .lq-avatar-ring::after {
  content:""; position:absolute; inset:${pw+1}px; border-radius:50%;
  background:var(--background,#0a0a0f);
}

/* 21. Holo Edge — full iridescent spectrum morph */
.lq-border-s-hologram .lq-avatar-ring {
  background: linear-gradient(135deg,#ff0066,${b1},#00ff88,#ff9900,#ff0066);
  background-size:400% 400%;
  padding:${pw}px;
  animation: lq-s-holo-v4 ${sp} ease infinite;
  box-shadow:0 0 ${pw*7}px color-mix(in srgb,${b1} 55%,transparent);
  opacity:${op};
}
.lq-border-s-hologram .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(255,255,255,0.35) 0deg 20deg,transparent 20deg 180deg,rgba(255,255,255,0.25) 180deg 200deg,transparent 200deg 360deg);
  animation: lqSpin ${sp} linear infinite; mix-blend-mode:overlay;
}
@keyframes lq-s-holo-v4 { 0%,100%{background-position:0% 50%;filter:hue-rotate(0deg)} 50%{background-position:100% 50%;filter:hue-rotate(90deg)} }

/* 22. Gentle Wave — oscillating tri-shadow */
.lq-border-s-wave .lq-avatar-ring {
  box-shadow:0 0 0 ${pw-1}px ${b1},0 0 ${pw*4}px color-mix(in srgb,${b1} 45%,transparent);
  animation: lq-s-wave-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-s-wave .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,color-mix(in srgb,${b1} 50%,transparent) 0deg 30deg,transparent 30deg 330deg,color-mix(in srgb,${b1} 50%,transparent) 330deg 360deg);
  animation: lqSpin ${sp} ease-in-out infinite;
}
@keyframes lq-s-wave-v4 {
  0%,100%{box-shadow:0 0 0 ${pw-1}px ${b1},0 -${pw*2}px ${pw*4}px color-mix(in srgb,${b1} 50%,transparent)}
  25%    {box-shadow:0 0 0 ${pw-1}px ${b2},${pw*2}px 0 ${pw*4}px color-mix(in srgb,${b2} 50%,transparent)}
  50%    {box-shadow:0 0 0 ${pw-1}px ${b3},0 ${pw*2}px ${pw*4}px color-mix(in srgb,${b3} 50%,transparent)}
  75%    {box-shadow:0 0 0 ${pw-1}px ${b1},-${pw*2}px 0 ${pw*4}px color-mix(in srgb,${b1} 50%,transparent)}
}

/* 23. Orbit Trace — 2 comet dots orbiting */
.lq-border-s-orbit-trace .lq-avatar-ring { box-shadow:0 0 0 1px rgba(255,255,255,0.06); opacity:${op}; }
.lq-border-s-orbit-trace .lq-avatar-ring::before {
  content:""; position:absolute; border-radius:50%;
  width:${pw+4}px; height:${pw+4}px; background:${b1};
  inset:unset; top:-${Math.round((pw+4)/2)}px; left:calc(50% - ${Math.round((pw+4)/2)}px);
  box-shadow:0 0 ${pw*3}px ${pw+2}px color-mix(in srgb,${b1} 80%,transparent);
  animation: lqSpin ${sp} linear infinite;
  transform-origin:center calc(50% + 50px);
}
.lq-border-s-orbit-trace .lq-avatar-ring::after {
  content:""; position:absolute; border-radius:50%;
  width:${pw+2}px; height:${pw+2}px; background:${b3};
  inset:unset; top:-${Math.round((pw+2)/2)}px; left:calc(50% - ${Math.round((pw+2)/2)}px);
  box-shadow:0 0 ${pw*2}px ${pw}px color-mix(in srgb,${b3} 70%,transparent);
  animation: lqSpinR ${spH} linear infinite;
  transform-origin:center calc(50% + 50px);
}

/* 24. Focus Brackets — scanning corners with glow */
.lq-border-s-focus-brackets .lq-avatar-ring { animation: lq-s-focus-v4 ${sp} ease-in-out infinite; opacity:${op}; }
.lq-border-s-focus-brackets .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent;
  border:${pw}px solid transparent;
  border-top-color:${b1}; border-left-color:${b1};
  animation: lqSpin ${sp} linear infinite;
  box-shadow:inset 0 0 ${pw*2}px color-mix(in srgb,${b1} 30%,transparent);
}
.lq-border-s-focus-brackets .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent;
  border:${pw}px solid transparent;
  border-bottom-color:${b3}; border-right-color:${b3};
  animation: lqSpinR ${sp} linear infinite;
  box-shadow:inset 0 0 ${pw*2}px color-mix(in srgb,${b3} 30%,transparent);
}
@keyframes lq-s-focus-v4 {
  0%,100%{ box-shadow:-${pw+2}px -${pw+2}px 0 ${b1},${pw+2}px ${pw+2}px 0 ${b3}; }
  50%    { box-shadow:-${pw+4}px -${pw+4}px 0 ${b2},${pw+4}px ${pw+4}px 0 ${b2},0 0 ${pw*5}px color-mix(in srgb,${b2} 40%,transparent); }
}

/* ── INFORMAL ────────────────────────────────────────────────── */

/* 25. Sparkle Shine — 8-point starburst */
.lq-border-i-sparkle-v2 .lq-avatar-ring { padding:${pw}px; opacity:${op}; }
.lq-border-i-sparkle-v2 .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,
    ${b1} 0deg 8deg,transparent 8deg 40deg,${b2} 40deg 48deg,transparent 48deg 80deg,
    ${b1} 80deg 88deg,transparent 88deg 120deg,${b2} 120deg 128deg,transparent 128deg 160deg,
    ${b3} 160deg 168deg,transparent 168deg 200deg,${b1} 200deg 208deg,transparent 208deg 240deg,
    ${b2} 240deg 248deg,transparent 248deg 280deg,${b3} 280deg 288deg,transparent 288deg 360deg);
  animation: lqSpin ${sp} linear infinite;
  filter:drop-shadow(0 0 ${pw}px color-mix(in srgb,${b1} 80%,transparent));
}
.lq-border-i-sparkle-v2 .lq-avatar-ring::after { content:""; position:absolute; inset:${pw+1}px; background:var(--background,#0a0a0f); border-radius:50%; }

/* 26. Energy Flame — fire morph with hue animation */
.lq-border-i-fire .lq-avatar-ring {
  background: conic-gradient(from 0deg,#ef4444,#f97316,#eab308,#ef4444);
  padding:${pw+1}px;
  animation: lqSpin ${spH} linear infinite, lqMorphB ${sp} ease-in-out infinite;
  filter: drop-shadow(0 0 ${pw*4}px rgba(239,68,68,0.8)) drop-shadow(0 0 ${pw*8}px rgba(249,115,22,0.4));
  opacity:${op};
}
.lq-border-i-fire .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 180deg,rgba(255,255,150,.7) 0deg 20deg,transparent 20deg 340deg,rgba(255,255,150,.5) 340deg 360deg);
  animation: lqSpinR ${spH} linear infinite; mix-blend-mode:overlay;
}
.lq-border-i-fire .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(239,68,68,0.3);
  animation: lqFadeOut ${spH} ease-out infinite;
  filter:blur(2px);
}

/* 27. Floating Orbs — 4 glowing orbs rotating */
.lq-border-i-floating-icons .lq-avatar-ring { box-shadow:0 0 0 1px rgba(255,255,255,0.05); opacity:${op}; }
.lq-border-i-floating-icons .lq-avatar-ring::before {
  content:""; position:absolute; inset:-${pw}px; border-radius:50%; background:transparent;
  box-shadow:${pw*3}px -${pw*3}px ${pw+2}px ${pw+2}px ${b1},${pw*3}px ${pw*3}px ${pw+2}px ${pw+2}px ${b3},-${pw*3}px ${pw*3}px ${pw+2}px ${pw+2}px ${b2},-${pw*3}px -${pw*3}px ${pw+2}px ${pw+2}px color-mix(in srgb,${b1} 60%,${b3});
  animation: lqSpin ${sp} linear infinite; filter:blur(1px);
}
.lq-border-i-floating-icons .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b1} 15%,transparent);
  animation: lqSpinR ${spD} linear infinite;
}

/* 28. Neon Flicker — tube flicker with glow */
.lq-border-i-neon-flicker .lq-avatar-ring {
  box-shadow:0 0 0 ${pw-1}px ${b1},0 0 ${pw*2}px ${b1},0 0 ${pw*6}px color-mix(in srgb,${b1} 60%,transparent),0 0 ${pw*12}px color-mix(in srgb,${b1} 30%,transparent);
  animation: lq-i-neon-v4 ${sp} linear infinite;
  opacity:${op};
}
@keyframes lq-i-neon-v4 {
  0%,18%,22%,25%,53%,57%,100%{ box-shadow:0 0 0 ${pw-1}px ${b1},0 0 ${pw*2}px ${b1},0 0 ${pw*6}px color-mix(in srgb,${b1} 60%,transparent); opacity:${op}; }
  19%,24%{ opacity:${op*.5}; box-shadow:0 0 0 ${pw-1}px color-mix(in srgb,${b1} 30%,transparent); }
  20%,23%{ opacity:${op*.1}; }
  54%,56%{ opacity:${op*.7}; }
}

/* 29. Digital Glitch — chromatic aberration tear */
.lq-border-i-glitch .lq-avatar-ring { animation: lq-i-glitch-v4 ${sp} infinite; opacity:${op}; }
.lq-border-i-glitch .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent; border:${pw}px solid #00ffff;
  animation: lq-i-glitch-a-v4 ${sp} infinite; mix-blend-mode:screen;
}
.lq-border-i-glitch .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent; border:${pw}px solid #ff0080;
  animation: lq-i-glitch-b-v4 ${sp} infinite; mix-blend-mode:screen;
}
@keyframes lq-i-glitch-v4 { 0%,80%,100%{transform:translate(0);filter:none} 81%{transform:translate(-3px,1px);filter:hue-rotate(90deg)} 83%{transform:translate(3px,-1px)} 85%{transform:translate(0);filter:none} }
@keyframes lq-i-glitch-a-v4 { 0%,80%,100%{transform:translate(0)} 81%{transform:translate(-4px,0)} 84%{transform:translate(4px,0)} 85%{transform:translate(0)} }
@keyframes lq-i-glitch-b-v4 { 0%,80%,100%{transform:translate(0)} 82%{transform:translate(4px,0)} 84%{transform:translate(-4px,0)} 85%{transform:translate(0)} }

/* 30. Rainbow Flow — full spectrum + brightness pulse */
.lq-border-i-rainbow-flow .lq-avatar-ring {
  background: conic-gradient(from 0deg,#ff0000,#ff7700,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000);
  padding:${pw}px;
  animation: lqSpin ${sp} linear infinite, lqHueB ${spD} linear infinite;
  filter:drop-shadow(0 0 ${pw*3}px rgba(255,100,100,0.6));
  opacity:${op};
}
.lq-border-i-rainbow-flow .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(255,255,255,.5) 0deg 15deg,transparent 15deg 345deg,rgba(255,255,255,.4) 345deg 360deg);
  animation: lqSpin ${sp} linear infinite;
}

/* 31. Frost Flow — ice crystal shimmer */
.lq-border-i-particle-snow-v2 .lq-avatar-ring {
  background: linear-gradient(135deg,#bfdbfe,${b1},#e0f2fe,#bfdbfe);
  background-size:300% 300%;
  padding:${pw}px;
  animation: lqShimB ${spD} ease-in-out infinite;
  box-shadow:0 0 ${pw*6}px rgba(147,197,253,0.6),inset 0 0 ${pw*3}px rgba(255,255,255,0.4);
  opacity:${op};
}
.lq-border-i-particle-snow-v2 .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(255,255,255,.9) 0deg 5deg,transparent 5deg 50deg,rgba(255,255,255,.7) 50deg 55deg,transparent 55deg 130deg,rgba(255,255,255,.9) 130deg 135deg,transparent 135deg 220deg,rgba(255,255,255,.7) 220deg 225deg,transparent 225deg 360deg);
  animation: lqSpinR ${spD} linear infinite; filter:blur(.5px);
}
.lq-border-i-particle-snow-v2 .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(147,197,253,0.2);
  animation: lqFadeOut ${spD} ease-out infinite;
}

/* 32. Cyber Matrix — data rain arcs */
.lq-border-i-cyberpunk .lq-avatar-ring {
  box-shadow:0 0 0 ${pw-1}px #00ff88,0 0 ${pw*4}px rgba(0,255,136,0.7),0 0 ${pw*10}px rgba(0,255,136,0.2);
  animation: lq-i-matrix-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-i-cyberpunk .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,#00ff88 0deg 8deg,transparent 8deg 88deg,#00ff88 88deg 96deg,transparent 96deg 176deg,#00ff88 176deg 184deg,transparent 184deg 264deg,#00ff88 264deg 272deg,transparent 272deg 360deg);
  animation: lqSpin ${spH} linear infinite; opacity:.8;
  filter:drop-shadow(0 0 ${pw}px #00ff88);
}
.lq-border-i-cyberpunk .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(0,255,136,0.2);
  animation: lqFadeOut ${sp} ease-out infinite;
}
@keyframes lq-i-matrix-v4 { 0%,100%{box-shadow:0 0 0 ${pw-1}px #00ff88,0 0 ${pw*4}px rgba(0,255,136,.7)} 50%{box-shadow:0 0 0 ${pw-1}px #00ff88,0 0 ${pw*8}px rgba(0,255,136,1),0 0 ${pw*16}px rgba(0,255,136,.3)} }

/* 33. Comic Pop — bold halftone wobble */
.lq-border-i-comic-pop .lq-avatar-ring {
  background:#facc15; padding:${pw+1}px;
  box-shadow:${pw+1}px ${pw+1}px 0 0 #000,0 0 0 ${pw}px #000;
  animation: lq-i-comic-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-i-comic-pop .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(circle at 30% 30%,rgba(255,255,255,0.7) 0%,transparent 60%);
}
.lq-border-i-comic-pop .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw-1}px;
  border:${pw}px solid #000; border-radius:50%; background:transparent;
}
@keyframes lq-i-comic-v4 { 0%,100%{transform:rotate(-2deg);box-shadow:${pw+1}px ${pw+1}px 0 0 #000} 25%{transform:rotate(1.5deg);box-shadow:${pw+2}px ${pw+2}px 0 0 #000} 75%{transform:rotate(-3deg);box-shadow:${pw}px ${pw}px 0 0 #000} }

/* 34. Liquid Edge — organic blob morph */
.lq-border-i-liquid-motion .lq-avatar-ring {
  background: linear-gradient(135deg,${b1},${b2},${b3});
  background-size:200% 200%;
  padding:${pw+1}px;
  animation: lqMorphB ${sp} ease-in-out infinite, lqShimB ${spD} ease-in-out infinite;
  filter:drop-shadow(0 0 ${pw*4}px color-mix(in srgb,${b1} 65%,transparent));
  opacity:${op};
}
.lq-border-i-liquid-motion .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: linear-gradient(135deg,rgba(255,255,255,0.3) 0%,transparent 60%);
  animation: lqMorphB ${sp} ease-in-out infinite reverse;
}
.lq-border-i-liquid-motion .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b1} 20%,transparent);
  animation: lqFadeOut ${sp} ease-out infinite;
  filter:blur(1px);
}

/* 35. Lava Lamp — thermal hue shift blob */
.lq-border-i-lava-lamp .lq-avatar-ring {
  background: conic-gradient(from 0deg,#ef4444,#f97316,#eab308,#a855f7,#ef4444);
  padding:${pw+1}px;
  animation: lqMorphB ${spD} ease-in-out infinite, lqHueB ${spD} linear infinite;
  filter:drop-shadow(0 0 ${pw*5}px rgba(239,68,68,0.7)) drop-shadow(0 0 ${pw*10}px rgba(168,85,247,0.4));
  opacity:${op};
}
.lq-border-i-lava-lamp .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(ellipse at 35% 25%,rgba(255,255,200,0.45) 0%,transparent 60%);
  animation: lqMorphB ${spD} ease-in-out infinite reverse;
}
.lq-border-i-lava-lamp .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(239,68,68,0.25);
  animation: lqFadeOut ${spH} ease-out infinite;
  filter:blur(2px);
}

/* 36. Plasma Sphere — electric burst tri-color */
.lq-border-i-plasma .lq-avatar-ring {
  background: conic-gradient(from 0deg,${b1},${b2},${b3},#06b6d4,${b1});
  padding:${pw+1}px;
  animation: lqSpin ${spH} linear infinite, lq-i-plasma-v4 ${sp} ease-in-out infinite;
  filter:drop-shadow(0 0 ${pw*6}px color-mix(in srgb,${b2} 95%,transparent));
  opacity:${op};
}
.lq-border-i-plasma .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(ellipse at 30% 25%,rgba(255,255,255,0.55) 0%,transparent 50%), radial-gradient(ellipse at 70% 75%,rgba(255,255,255,0.35) 0%,transparent 40%);
  animation: lqSpinR ${spH} linear infinite;
}
.lq-border-i-plasma .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b2} 25%,transparent);
  animation: lqFadeOut ${spH} ease-out infinite;
}
@keyframes lq-i-plasma-v4 {
  0%,100%{ filter:drop-shadow(0 0 ${pw*6}px color-mix(in srgb,${b1} 95%,transparent)); }
  33%    { filter:drop-shadow(0 0 ${pw*8}px color-mix(in srgb,${b2} 100%,transparent)); }
  66%    { filter:drop-shadow(0 0 ${pw*7}px color-mix(in srgb,${b3} 95%,transparent)); }
}

/* ── ARTISTIC ─────────────────────────────────────────────────── */

/* 37. Watercolor Ink — bleeding blur morph */
.lq-border-a-watercolor .lq-avatar-ring {
  background: linear-gradient(135deg,color-mix(in srgb,${b1} 75%,transparent),color-mix(in srgb,${b2} 55%,transparent),color-mix(in srgb,${b3} 65%,transparent));
  background-size:300% 300%;
  padding:${pw+2}px;
  animation: lqMorphB ${spD} ease-in-out infinite, lqShimB ${spD} ease-in-out infinite;
  filter:blur(0.8px) drop-shadow(0 0 ${pw*3}px color-mix(in srgb,${b2} 55%,transparent));
  opacity:${op};
}
.lq-border-a-watercolor .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(ellipse at 25% 25%,rgba(255,255,255,0.45) 0%,transparent 50%), radial-gradient(ellipse at 75% 75%,color-mix(in srgb,${b3} 35%,transparent) 0%,transparent 40%);
  animation: lqMorphB ${spD} ease-in-out infinite reverse; filter:blur(2px);
}
.lq-border-a-watercolor .lq-avatar { border-radius:50%!important; filter:none!important; }

/* 38. Brush Stroke — wet ink texture shake */
.lq-border-a-brush-stroke .lq-avatar-ring {
  background: linear-gradient(105deg,#0a0a0a 0%,#2a2a2a 20%,#1a1a1a 40%,#3a3a3a 55%,#111 70%,#222 85%,#0a0a0a 100%);
  background-size:300% 300%;
  padding:${pw+2}px; border-radius:48% 52% 44% 56% / 52% 44% 56% 48%;
  animation: lqShimB ${spD} ease-in-out infinite, lqMorphB ${spD} ease-in-out infinite;
  box-shadow:3px 2px 0 1px rgba(255,255,255,0.03),-2px -1px 0 1px rgba(0,0,0,0.8),0 ${pw*2}px ${pw*4}px rgba(0,0,0,0.7);
  opacity:${op};
}
.lq-border-a-brush-stroke .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:inherit;
  background: linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 40%,rgba(255,255,255,0.04) 80%);
  animation: lqMorphB ${spD} ease-in-out infinite reverse;
}

/* 39. Stained Glass — rotating prism segments */
.lq-border-a-stained-glass .lq-avatar-ring {
  background: conic-gradient(from 0deg,
    rgba(239,68,68,.9) 0deg 40deg,rgba(0,0,0,.9) 40deg 45deg,
    rgba(249,115,22,.9) 45deg 85deg,rgba(0,0,0,.9) 85deg 90deg,
    rgba(234,179,8,.9) 90deg 130deg,rgba(0,0,0,.9) 130deg 135deg,
    rgba(34,197,94,.9) 135deg 175deg,rgba(0,0,0,.9) 175deg 180deg,
    rgba(59,130,246,.9) 180deg 220deg,rgba(0,0,0,.9) 220deg 225deg,
    rgba(139,92,246,.9) 225deg 265deg,rgba(0,0,0,.9) 265deg 270deg,
    rgba(236,72,153,.9) 270deg 310deg,rgba(0,0,0,.9) 310deg 315deg,
    rgba(239,68,68,.9) 315deg 355deg,rgba(0,0,0,.9) 355deg 360deg);
  padding:${pw}px;
  animation: lqSpin ${spD} linear infinite;
  box-shadow:inset 0 0 ${pw*4}px rgba(255,255,255,0.25),0 0 ${pw*6}px color-mix(in srgb,${b1} 45%,transparent);
  opacity:${op};
}
.lq-border-a-stained-glass .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(255,255,255,0.4) 0deg 20deg,transparent 20deg 180deg,rgba(255,255,255,0.3) 180deg 200deg,transparent 200deg 360deg);
  animation: lqSpinR ${sp} linear infinite;
}

/* 40. Paper Cut — layered torn paper */
.lq-border-a-paper-cut .lq-avatar-ring {
  background: linear-gradient(145deg,#fafaf0,#f5f5dc,#ede8d0);
  padding:${pw+2}px; border-radius:46% 54% 58% 42% / 52% 46% 54% 48%;
  box-shadow:${pw}px ${pw}px 0 #d4d0b4,${pw*2}px ${pw*2}px 0 #c8c4a0,${pw*3}px ${pw*3}px 0 #bcb88c,0 0 0 1px #9a9070,0 ${pw*3}px ${pw*6}px rgba(0,0,0,0.25);
  animation: lq-a-paper-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-a-paper-cut .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:inherit;
  background: linear-gradient(135deg,rgba(255,255,255,0.75) 0%,transparent 55%);
}
@keyframes lq-a-paper-v4 { 0%,100%{transform:rotate(-1deg);box-shadow:${pw}px ${pw}px 0 #d4d0b4,${pw*2}px ${pw*2}px 0 #c8c4a0,${pw*3}px ${pw*3}px 0 #bcb88c} 50%{transform:rotate(1deg);box-shadow:${pw+1}px ${pw+1}px 0 #d4d0b4,${pw*3}px ${pw*3}px 0 #c8c4a0,${pw*4}px ${pw*4}px 0 #bcb88c} }

/* 41. Floral Trace — 16-petal rotating pattern */
.lq-border-a-floral-outline .lq-avatar-ring { padding:${pw}px; background:transparent; opacity:${op}; }
.lq-border-a-floral-outline .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,
    ${b3} 0deg 18deg,transparent 18deg 22deg,color-mix(in srgb,${b3} 70%,${b2}) 22deg 40deg,transparent 40deg 44deg,
    ${b3} 44deg 62deg,transparent 62deg 66deg,color-mix(in srgb,${b3} 70%,${b2}) 66deg 84deg,transparent 84deg 88deg,
    ${b2} 88deg 106deg,transparent 106deg 110deg,color-mix(in srgb,${b3} 70%,${b2}) 110deg 128deg,transparent 128deg 132deg,
    ${b3} 132deg 150deg,transparent 150deg 154deg,${b2} 154deg 172deg,transparent 172deg 176deg,
    ${b3} 176deg 194deg,transparent 194deg 198deg,${b2} 198deg 216deg,transparent 216deg 220deg,
    ${b3} 220deg 238deg,transparent 238deg 242deg,${b2} 242deg 260deg,transparent 260deg 264deg,
    ${b3} 264deg 282deg,transparent 282deg 286deg,${b2} 286deg 304deg,transparent 304deg 308deg,
    ${b3} 308deg 326deg,transparent 326deg 330deg,${b2} 330deg 348deg,transparent 348deg 360deg);
  animation: lqSpin ${spD} linear infinite;
  filter:drop-shadow(0 0 ${pw}px color-mix(in srgb,${b3} 65%,transparent));
}
.lq-border-a-floral-outline .lq-avatar-ring::after { content:""; position:absolute; inset:${pw+1}px; background:var(--background,#0a0a0f); border-radius:50%; }

/* 42. Nebula Mist — deep space particle drift */
.lq-border-a-nebula .lq-avatar-ring {
  background: conic-gradient(from 0deg,#1e1b4b,#312e81,#4c1d95,#6d28d9,#7c3aed,#5b21b6,#4c1d95,#312e81,#1e1b4b);
  padding:${pw+2}px;
  animation: lq-a-nebula-v4 ${spD} ease-in-out infinite, lqSpin 20s linear infinite;
  filter:drop-shadow(0 0 ${pw*5}px rgba(124,58,237,0.85)) drop-shadow(0 0 ${pw*10}px rgba(109,40,217,0.45));
  opacity:${op};
}
.lq-border-a-nebula .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(ellipse at 20% 30%,rgba(255,255,255,0.25) 0%,transparent 30%), radial-gradient(ellipse at 80% 70%,rgba(196,181,253,0.35) 0%,transparent 30%);
  animation: lq-a-nebula-v4 ${spD} ease-in-out infinite reverse; filter:blur(1px);
}
@keyframes lq-a-nebula-v4 { 0%,100%{background-position:0% 50%} 25%{background-position:100% 0%} 50%{background-position:100% 100%} 75%{background-position:0% 100%} }

/* 43. Charcoal Sketch — hand-drawn shake */
.lq-border-a-charcoal .lq-avatar-ring {
  background:transparent; padding:${pw+1}px;
  box-shadow:0 0 0 ${pw-1}px #222,1px 1px 0 1px #444,-1px -1px 0 1px #111,${pw}px ${pw-1}px 0 0 #555;
  animation: lq-a-charcoal-v4 ${spD} steps(4) infinite;
  opacity:${op};
}
.lq-border-a-charcoal .lq-avatar-ring::before {
  content:""; position:absolute; border:1px solid rgba(80,80,80,0.55); inset:-${pw}px;
  border-radius:52% 48% 50% 50% / 48% 52% 48% 52%; background:transparent;
  animation: lq-a-charcoal-shake ${sp === "0.5s" ? "0.08s" : "0.15s"} linear infinite;
}
@keyframes lq-a-charcoal-v4 { 0%{box-shadow:0 0 0 ${pw-1}px #222,1px 1px 0 1px #444,-1px -1px 0 1px #111} 25%{box-shadow:0 0 0 ${pw-1}px #1a1a1a,2px 1px 0 1px #555,-2px 0 0 1px #111} 50%{box-shadow:0 0 0 ${pw-1}px #333,1px 2px 0 1px #222,-1px -2px 0 1px #444} 75%{box-shadow:0 0 0 ${pw-1}px #222,-2px -1px 0 1px #555,2px 2px 0 1px #111} }
@keyframes lq-a-charcoal-shake { 0%,100%{transform:translate(0,0) rotate(.3deg)} 25%{transform:translate(.5px,-.5px) rotate(-.2deg)} 50%{transform:translate(-.5px,.5px) rotate(.4deg)} 75%{transform:translate(.5px,.5px) rotate(-.3deg)} }

/* 44. Crystal Mosaic — faceted prism shimmer */
.lq-border-a-mosaic .lq-avatar-ring {
  background: conic-gradient(from 0deg,
    #7dd3fc 0deg 25deg,#fff 25deg 30deg,#a5b4fc 30deg 55deg,#fff 55deg 60deg,#c4b5fd 60deg 85deg,#fff 85deg 90deg,
    #f9a8d4 90deg 115deg,#fff 115deg 120deg,#6ee7b7 120deg 145deg,#fff 145deg 150deg,#fde68a 150deg 175deg,#fff 175deg 180deg,
    #7dd3fc 180deg 205deg,#fff 205deg 210deg,#a5b4fc 210deg 235deg,#fff 235deg 240deg,#c4b5fd 240deg 265deg,#fff 265deg 270deg,
    #f9a8d4 270deg 295deg,#fff 295deg 300deg,#6ee7b7 300deg 325deg,#fff 325deg 330deg,#fde68a 330deg 355deg,#fff 355deg 360deg);
  padding:${pw}px;
  animation: lqSpin ${spD} linear infinite;
  box-shadow:inset 0 0 ${pw*3}px rgba(255,255,255,0.4),0 0 ${pw*6}px color-mix(in srgb,${b1} 45%,transparent);
  opacity:${op};
}
.lq-border-a-mosaic .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(255,255,255,.55) 0deg 10deg,transparent 10deg 180deg,rgba(255,255,255,.45) 180deg 190deg,transparent 190deg 360deg);
  animation: lqSpinR ${sp} linear infinite;
}

/* 45. Aurora Borealis — northern lights cascade */
.lq-border-a-aurora .lq-avatar-ring {
  background: linear-gradient(135deg,#00ff88,#00ccff,#9900ff,#00ffcc,#00ff88);
  background-size:400% 400%;
  padding:${pw+2}px;
  animation: lq-a-aurora-v4 ${sp} ease-in-out infinite;
  filter:drop-shadow(0 0 ${pw*5}px rgba(0,255,136,0.75)) drop-shadow(0 0 ${pw*10}px rgba(0,204,255,0.45));
  opacity:${op};
}
.lq-border-a-aurora .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(ellipse at 20% 50%,rgba(0,255,136,0.45) 0%,transparent 50%), radial-gradient(ellipse at 80% 50%,rgba(153,0,255,0.45) 0%,transparent 50%);
  filter:blur(3px); animation: lqPulseB ${sp} ease-in-out infinite;
}
.lq-border-a-aurora .lq-avatar-ring::after { content:""; position:absolute; inset:${pw+2}px; background:var(--background,#0a0a0f); border-radius:50%; }
@keyframes lq-a-aurora-v4 { 0%,100%{background-position:0% 50%;filter:drop-shadow(0 0 ${pw*5}px rgba(0,255,136,.75)) hue-rotate(0deg)} 33%{background-position:100% 50%;filter:drop-shadow(0 0 ${pw*7}px rgba(0,204,255,.85)) hue-rotate(30deg)} 66%{background-position:50% 0%;filter:drop-shadow(0 0 ${pw*6}px rgba(153,0,255,.75)) hue-rotate(60deg)} }

/* 46. Oil Texture — thick impasto swirl */
.lq-border-a-oil-paint .lq-avatar-ring {
  background: conic-gradient(from 0deg,#92400e,#b45309,#d97706,#f59e0b,#d97706,#b45309,#92400e,#a16207,#ca8a04,#eab308,#ca8a04,#a16207,#92400e);
  padding:${pw+3}px;
  animation: lqMorphB ${spD} ease-in-out infinite, lqSpin 30s linear infinite;
  box-shadow:0 ${pw*2}px ${pw*5}px rgba(0,0,0,0.6),inset 0 1px 2px rgba(255,255,200,0.35);
  filter:drop-shadow(${pw}px ${pw+1}px ${pw+2}px rgba(0,0,0,0.5));
  opacity:${op};
}
.lq-border-a-oil-paint .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: radial-gradient(ellipse at 30% 25%,rgba(255,255,200,0.45) 0%,transparent 55%);
  animation: lqMorphB ${spD} ease-in-out infinite reverse;
}

/* ── CYBER ─────────────────────────────────────────────────────── */

/* 47. Mainframe HUD — scan line + bracket */
.lq-border-c-mainframe .lq-avatar-ring {
  box-shadow:0 0 0 1px #00ff88,0 0 ${pw*5}px rgba(0,255,136,0.45);
  outline:1px dashed rgba(0,255,136,0.3); outline-offset:${pw*2}px;
  animation: lq-c-hud-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-c-mainframe .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: linear-gradient(transparent 47%,rgba(0,255,136,0.25) 47%,rgba(0,255,136,0.25) 53%,transparent 53%);
  animation: lq-c-scan-v4 ${sp} linear infinite;
}
.lq-border-c-mainframe .lq-avatar-ring::after {
  content:""; position:absolute; background:transparent;
  border:${pw}px solid transparent; border-top-color:#00ff88; border-left-color:#00ff88;
  inset:-${pw*2}px; border-radius:4px; animation: lqSpin ${spD} linear infinite;
}
@keyframes lq-c-hud-v4 { 0%,100%{box-shadow:0 0 0 1px #00ff88,0 0 ${pw*5}px rgba(0,255,136,.45)} 50%{box-shadow:0 0 0 1px #00ff88,0 0 ${pw*9}px rgba(0,255,136,.85),0 0 ${pw*18}px rgba(0,255,136,.2)} }
@keyframes lq-c-scan-v4 { 0%{transform:translateY(-100%);opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{transform:translateY(100%);opacity:0} }

/* 48. Circuit Board — animated trace paths */
.lq-border-c-circuit .lq-avatar-ring {
  box-shadow:0 0 0 ${pw-1}px #00d4aa,0 0 ${pw*5}px rgba(0,212,170,0.5);
  animation: lq-c-circuit-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-c-circuit .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,#00d4aa 0deg 3deg,transparent 3deg 87deg,#00d4aa 87deg 93deg,transparent 93deg 177deg,#00d4aa 177deg 183deg,transparent 183deg 267deg,#00d4aa 267deg 273deg,transparent 273deg 360deg);
  animation: lqSpin ${sp} linear infinite;
  filter:drop-shadow(0 0 ${pw}px #00d4aa);
}
.lq-border-c-circuit .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(0,212,170,0.2); background:transparent;
  animation: lqSpinR ${spD} linear infinite;
}
@keyframes lq-c-circuit-v4 { 0%,100%{box-shadow:0 0 0 ${pw-1}px #00d4aa,0 0 ${pw*5}px rgba(0,212,170,.5)} 50%{box-shadow:0 0 0 ${pw-1}px #00d4aa,0 0 ${pw*9}px rgba(0,212,170,.85),0 0 ${pw*15}px rgba(0,212,170,.2)} }

/* 49. Data Stream — binary rain arc */
.lq-border-c-data-stream .lq-avatar-ring {
  background: conic-gradient(from 0deg,
    #00ff88 0deg 4deg,rgba(0,255,136,.4) 4deg 8deg,transparent 8deg 58deg,
    #00ff88 58deg 62deg,rgba(0,255,136,.4) 62deg 66deg,transparent 66deg 116deg,
    #00ff88 116deg 120deg,rgba(0,255,136,.4) 120deg 124deg,transparent 124deg 174deg,
    #00ff88 174deg 178deg,rgba(0,255,136,.4) 178deg 182deg,transparent 182deg 232deg,
    #00ff88 232deg 236deg,rgba(0,255,136,.4) 236deg 240deg,transparent 240deg 290deg,
    #00ff88 290deg 294deg,rgba(0,255,136,.4) 294deg 298deg,transparent 298deg 360deg);
  padding:${pw}px;
  animation: lqSpin ${spH} linear infinite;
  filter:drop-shadow(0 0 ${pw*3}px #00ff88) drop-shadow(0 0 ${pw*6}px rgba(0,255,136,0.45));
  opacity:${op};
}
.lq-border-c-data-stream .lq-avatar-ring::before { content:""; position:absolute; inset:${pw+1}px; background:var(--background,#0a0a0f); border-radius:50%; }
.lq-border-c-data-stream .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(0,255,136,0.2); background:transparent;
  animation: lqFadeOut ${sp} ease-out infinite;
}

/* 50. Active Shield — pulsing barrier + scan */
.lq-border-c-shield-active .lq-avatar-ring {
  box-shadow:0 0 0 ${pw-1}px #3b82f6,0 0 ${pw*7}px rgba(59,130,246,0.6),inset 0 0 ${pw*5}px rgba(59,130,246,0.15);
  animation: lq-c-shield-v4 ${sp} ease-in-out infinite;
  opacity:${op};
}
.lq-border-c-shield-active .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(59,130,246,.6) 0deg 25deg,transparent 25deg 335deg,rgba(59,130,246,.4) 335deg 360deg);
  animation: lqSpin ${sp} linear infinite; filter:drop-shadow(0 0 ${pw}px rgba(59,130,246,0.6));
}
.lq-border-c-shield-active .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(59,130,246,0.3); background:transparent;
  animation: lqFadeOut ${sp} ease-out infinite .5s;
}
@keyframes lq-c-shield-v4 { 0%,100%{box-shadow:0 0 0 ${pw-1}px #3b82f6,0 0 ${pw*7}px rgba(59,130,246,.6)} 50%{box-shadow:0 0 0 ${pw-1}px #60a5fa,0 0 ${pw*12}px rgba(59,130,246,1),0 0 ${pw*20}px rgba(59,130,246,.3)} }

/* 51. Retina Scan — biometric sweep line */
.lq-border-c-scanning .lq-avatar-ring { box-shadow:0 0 0 ${pw-1}px #ef4444,0 0 ${pw*4}px rgba(239,68,68,0.5); opacity:${op}; }
.lq-border-c-scanning .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: linear-gradient(transparent 47%,rgba(239,68,68,0.5) 47%,rgba(239,68,68,0.5) 53%,transparent 53%);
  animation: lq-c-scan-v4 ${sp} ease-in-out infinite;
}
.lq-border-c-scanning .lq-avatar-ring::after {
  content:""; position:absolute; inset:-${pw*2}px; border-radius:50%;
  border:1px solid rgba(239,68,68,0.3); background:transparent;
  animation: lqFadeOut ${sp} ease-out infinite;
}

/* 52. Quantum State — superposition blur collapse */
.lq-border-c-quantum .lq-avatar-ring {
  filter:drop-shadow(0 0 ${pw*4}px color-mix(in srgb,${b2} 95%,transparent));
  animation: lq-c-quantum-v4 ${spH} linear infinite;
  opacity:${op};
}
.lq-border-c-quantum .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,transparent 0deg 88deg,${b2} 88deg 92deg,transparent 92deg 178deg,${b1} 178deg 182deg,transparent 182deg 268deg,${b3} 268deg 272deg,transparent 272deg 360deg);
  animation: lqSpin ${spH} linear infinite;
}
.lq-border-c-quantum .lq-avatar-ring::after { content:""; position:absolute; inset:${pw}px; background:var(--background,#0a0a0f); border-radius:50%; }
@keyframes lq-c-quantum-v4 { 0%,94%,100%{filter:drop-shadow(0 0 ${pw*4}px color-mix(in srgb,${b2} 95%,transparent))} 95%{filter:drop-shadow(0 0 ${pw*8}px color-mix(in srgb,${b1} 100%,transparent)) blur(.5px)} 97%{filter:drop-shadow(0 0 ${pw*3}px color-mix(in srgb,${b3} 80%,transparent))} }

/* 53. Nanotech Mesh — hexagonal lattice */
.lq-border-c-nanotech .lq-avatar-ring { padding:${pw}px; background:transparent; opacity:${op}; }
.lq-border-c-nanotech .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: repeating-conic-gradient(
    color-mix(in srgb,${b1} 45%,transparent) 0deg 8deg,
    color-mix(in srgb,${b1} 6%,transparent) 8deg 12deg,
    color-mix(in srgb,${b1} 45%,transparent) 12deg 20deg,
    color-mix(in srgb,${b1} 6%,transparent) 20deg 30deg);
  animation: lqSpin ${spD} linear infinite;
  filter:drop-shadow(0 0 ${pw}px color-mix(in srgb,${b1} 50%,transparent));
}
.lq-border-c-nanotech .lq-avatar-ring::after {
  content:""; position:absolute; inset:${pw}px; border-radius:50%;
  border:1px solid color-mix(in srgb,${b1} 35%,transparent); background:transparent;
  animation: lqSpinR ${sp} linear infinite;
}

/* 54. Warp Drive — light speed tunnel */
.lq-border-c-warp-drive .lq-avatar-ring {
  background: conic-gradient(from 0deg,${b1},#c0c0ff,#ffffff,#c0c0ff,${b2},#ffffff,${b1});
  padding:${pw}px;
  animation: lqSpin .2s linear infinite;
  filter:drop-shadow(0 0 ${pw*8}px color-mix(in srgb,${b1} 100%,transparent)) drop-shadow(0 0 ${pw*16}px color-mix(in srgb,${b1} 65%,transparent));
  opacity:${op};
}
.lq-border-c-warp-drive .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: conic-gradient(from 0deg,rgba(255,255,255,0.7) 0deg 10deg,transparent 10deg 350deg,rgba(255,255,255,0.5) 350deg 360deg);
  animation: lqSpin .2s linear infinite;
}
.lq-border-c-warp-drive .lq-avatar-ring::after { content:""; position:absolute; inset:${pw+1}px; background:var(--background,#0a0a0f); border-radius:50%; }

/* 55. Legacy BIOS — phosphor monitor flicker */
.lq-border-c-bios .lq-avatar-ring {
  box-shadow:0 0 0 ${pw-1}px #00aaff,0 0 0 ${pw+1}px #001133,0 0 0 ${pw+3}px #00aaff,0 0 ${pw*7}px rgba(0,170,255,0.6);
  animation: lq-c-bios-v4 1.5s steps(6) infinite;
  opacity:${op};
}
.lq-border-c-bios .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background: linear-gradient(0deg,transparent 0%,rgba(0,170,255,0.05) 50%,transparent 100%);
  animation: lq-c-scan-v4 .05s linear infinite;
}
@keyframes lq-c-bios-v4 { 0%,60%,100%{opacity:${op};box-shadow:0 0 0 ${pw-1}px #00aaff,0 0 0 ${pw+1}px #001133,0 0 0 ${pw+3}px #00aaff,0 0 ${pw*7}px rgba(0,170,255,.6)} 10%{opacity:${op*.9};box-shadow:0 0 0 ${pw-1}px #00aaff,0 0 0 ${pw+1}px #001133,0 0 0 ${pw+3}px #00aaff,0 0 ${pw*2}px rgba(0,170,255,.3)} 20%{opacity:${op*.6}} 30%{opacity:${op};box-shadow:0 0 0 ${pw-1}px #00ffff,0 0 0 ${pw+1}px #001133,0 0 0 ${pw+3}px #00aaff,0 0 ${pw*10}px rgba(0,255,255,.7)} }

/* 56. Signal Static — chromatic noise RGB split */
.lq-border-c-glitch-static .lq-avatar-ring { animation: lq-c-static-v4 .08s steps(1) infinite; opacity:${op}; }
.lq-border-c-glitch-static .lq-avatar-ring::before {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent; border:${pw}px solid #00ffff;
  animation: lq-c-static-a-v4 .08s steps(1) infinite; mix-blend-mode:screen;
}
.lq-border-c-glitch-static .lq-avatar-ring::after {
  content:""; position:absolute; inset:0; border-radius:50%;
  background:transparent; border:${pw}px solid #ff0080;
  animation: lq-c-static-b-v4 .08s steps(1) infinite; mix-blend-mode:screen;
}
@keyframes lq-c-static-v4   { 0%{filter:drop-shadow(${pw}px 0 0 #00ffff) drop-shadow(-${pw}px 0 0 #ff0080)} 25%{filter:drop-shadow(-${pw}px 0 0 #00ff80) drop-shadow(${pw}px 0 0 #0080ff)} 50%{filter:drop-shadow(0 ${pw}px 0 #ff0080) drop-shadow(0 -${pw}px 0 #00ffff)} 75%{filter:drop-shadow(${pw}px ${pw}px 0 #0080ff) drop-shadow(-${pw}px -${pw}px 0 #ff0080)} }
@keyframes lq-c-static-a-v4 { 0%{transform:translate(${pw}px,0)} 25%{transform:translate(-${pw}px,1px)} 50%{transform:translate(1px,-1px)} 75%{transform:translate(-1px,${pw}px)} }
@keyframes lq-c-static-b-v4 { 0%{transform:translate(-${pw}px,0)} 25%{transform:translate(${pw}px,-1px)} 50%{transform:translate(-1px,1px)} 75%{transform:translate(1px,-${pw}px)} }

/* ── GPU hints ──────────────────────────────────────────────── */
[class*="lq-border-s-rotate"] .lq-avatar-ring,
[class*="lq-border-s-dual"] .lq-avatar-ring,
[class*="lq-border-i-fire"] .lq-avatar-ring,
[class*="lq-border-i-rainbow"] .lq-avatar-ring,
[class*="lq-border-i-plasma"] .lq-avatar-ring,
[class*="lq-border-i-liquid"] .lq-avatar-ring,
[class*="lq-border-c-warp"] .lq-avatar-ring,
[class*="lq-border-c-quantum"] .lq-avatar-ring,
[class*="lq-border-c-data"] .lq-avatar-ring { will-change:transform; }
`;
}


// ─── Build CSS from profile state ─────────────────────────────────────────────
function buildFullCss(profile: ProfileState): string {
  const bgMap: Record<string,string> = {
    gradient: `linear-gradient(135deg, #0d0d1f 0%, #1a0533 50%, #0f172a 100%)`,
    mesh: `linear-gradient(135deg,#0d0d1f,#1a0533,#0f172a)`,
    solid: `#0d0d1f`,
  };
  const bg = profile.bgType === "image" ? `url('${profile.bgValue}') center/cover no-repeat` :
             (profile.bgValue && profile.bgType === "gradient") ? profile.bgValue :
             bgMap[profile.bgType] || bgMap.gradient;

  const fontFamily = profile.font || "'Inter', -apple-system, sans-serif";

  const cardBlur = profile.cardBlur ?? 24;
  const cardOp = profile.cardOpacity ?? 0.06;
  const cardBR = profile.cardBorderRadius ?? 28;
  const cardBC = profile.cardBorderColor || 'rgba(255,255,255,0.12)';
  const cardGlowStr = profile.cardGlow ? `box-shadow:0 0 40px ${profile.cardGlowColor||profile.primaryColor}44,0 32px 64px rgba(0,0,0,0.4);` : 'box-shadow:0 32px 64px rgba(0,0,0,0.4);';
  const cardBg: Record<string,string> = {
    glass: `background:rgba(255,255,255,${cardOp});backdrop-filter:blur(${cardBlur}px);-webkit-backdrop-filter:blur(${cardBlur}px);border:1px solid ${cardBC};${cardGlowStr}`,
    solid: `background:rgba(15,15,25,0.95);border:1px solid ${cardBC};${cardGlowStr}`,
    minimal: `background:transparent;border:none;${cardGlowStr}`,
    neon: `background:rgba(10,10,20,0.9);border:1px solid ${profile.primaryColor};box-shadow:0 0 30px ${profile.primaryColor}44,inset 0 0 30px rgba(0,0,0,0.5)${profile.cardGlow?`,0 0 60px ${profile.cardGlowColor||profile.primaryColor}44`:''};`,
  };

  const badgeColors: Record<string,string> = {
    green: `background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.25);color:#4ade80;`,
    blue: `background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.25);color:#60a5fa;`,
    purple: `background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.25);color:#c084fc;`,
    red: `background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#f87171;`,
    none: `background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);`,
  };

  const radiusMap: Record<string,string> = { sm:"8px", md:"14px", lg:"20px", full:"999px" };
  const btnRadius = radiusMap[profile.buttonRadius] || "14px";
  const avatarRadius = profile.avatarShape === "circle" ? "50%" : profile.avatarShape === "rounded" ? "20px" : "8px";

  const btnAnim: Record<string,string> = {
    lift: `.lq-btn:hover{transform:translateY(-3px)!important;}`,
    glow: `.lq-btn:hover{box-shadow:0 0 20px ${profile.primaryColor}66!important;}`,
    scale: `.lq-btn:hover{transform:scale(1.03)!important;}`,
    none: "",
  };

  const layoutMap: Record<string,string> = {
    center: `align-items:center;`,
    left: `align-items:flex-start;padding-left:max(24px,10%);`,
    wide: `align-items:center;`,
  };

  const cardMaxWidth = profile.pageLayout === "wide" ? "520px" : "400px";

  const scrollAnim = profile.scrollAnimation !== "none" ? `
.lq-card { animation: lq-${profile.scrollAnimation} 0.6s cubic-bezier(0.16,1,0.3,1) both; }
@keyframes lq-fade { from{opacity:0} to{opacity:1} }
@keyframes lq-slide { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes lq-zoom { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }` : "";

  const cursorStyle = profile.cursorEffect === "glow" ? `
* { cursor: auto !important; }
#lq-cursor-glow { 
  position: fixed; 
  width: 30px; 
  height: 30px; 
  background: ${profile.primaryColor}; 
  border-radius: 50%; 
  pointer-events: none; 
  z-index: 99999; 
  mix-blend-mode: screen; 
  filter: blur(4px);
  box-shadow: 0 0 20px ${profile.primaryColor}, 0 0 40px ${profile.primaryColor}88;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, opacity 0.2s;
  opacity: 0;
}
body:hover #lq-cursor-glow { opacity: 1; }
` : "";

  const borderCss = buildBorderCss(profile);

  // Particle background
  const particleBgCss = profile.particleBg !== 'none' ? buildParticleBg(profile.particleBg, profile.primaryColor) : '';

  return `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:${profile.primaryColor};--accent:${profile.accentColor};--b1:${profile.borderColor1||profile.primaryColor};--b2:${profile.borderColor2||profile.accentColor};--b3:${profile.borderColor3||'#ec4899'};--background:#0a0a0f;}
.lq-page{min-height:100vh;background:${bg};display:flex;flex-direction:column;${layoutMap[profile.pageLayout] || layoutMap.center}justify-content:center;padding:40px 16px;font-family:${fontFamily};position:relative;overflow:hidden;}
.lq-orbs{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
.lq-orb{position:absolute;border-radius:50%;filter:blur(80px);animation:lqFloat 8s ease-in-out infinite;}
.lq-orb1{width:350px;height:350px;background:${profile.primaryColor}33;top:5%;left:5%;}
.lq-orb2{width:280px;height:280px;background:${profile.accentColor}26;bottom:10%;right:5%;animation-delay:-4s;}
@keyframes lqFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-25px)}}
.lq-card{position:relative;z-index:1;width:100%;max-width:${cardMaxWidth};display:flex;flex-direction:column;align-items:center;padding:36px 24px 32px;border-radius:${cardBR}px;${cardBg[profile.cardStyle] || cardBg.glass}}
.lq-avatar-wrapper{position:relative;padding:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;border-radius:${avatarRadius};}
.lq-avatar-ring{padding:4px;border-radius:inherit;background:linear-gradient(135deg,${profile.primaryColor},${profile.accentColor});position:relative;z-index:2;}
.lq-avatar-glow .lq-avatar{box-shadow:0 0 24px ${profile.primaryColor}88;}
.lq-avatar{object-fit:cover;border:3px solid #0d0d1f;display:block;border-radius:inherit;}
${borderCss}
.lq-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;font-size:11px;font-weight:500;margin-bottom:14px;}
${Object.entries(badgeColors).map(([k,v])=>`.lq-badge-${k}{${v}}`).join("\n")}
.lq-badge-dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:lqPulse 2s ease infinite;flex-shrink:0;}
@keyframes lqPulse{0%,100%{opacity:1}50%{opacity:.3}}
.lq-name{color:#fff;font-size:${profile.nameFontSize||24}px;font-weight:700;margin-bottom:8px;letter-spacing:-0.3px;display:flex;align-items:center;gap:6px;}
.lq-verified{flex-shrink:0;}
.lq-bio{color:rgba(255,255,255,0.5);font-size:${profile.bioFontSize||14}px;text-align:center;line-height:1.6;margin-bottom:20px;max-width:300px;}
.lq-stats{display:flex;align-items:center;justify-content:space-around;padding:14px 20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;width:100%;margin-bottom:20px;}
.lq-stat{display:flex;flex-direction:column;align-items:center;gap:2px;}
.lq-stat-n{font-size:18px;font-weight:700;color:#fff;}
.lq-stat-l{font-size:10px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.08em;}
.lq-stat-div{width:1px;height:28px;background:rgba(255,255,255,0.08);}
.lq-music{width:100%;border-radius:12px;overflow:hidden;margin-bottom:16px;opacity:.9;}
.lq-countdown{display:flex;gap:12px;justify-content:center;margin-bottom:20px;}
.lq-cd-item{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 14px;background:rgba(255,255,255,0.06);border-radius:12px;min-width:52px;}
.lq-cd-n{font-size:22px;font-weight:700;color:#fff;line-height:1;}
.lq-cd-l{font-size:9px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:.1em;}
.lq-links{display:flex;flex-direction:column;gap:${profile.linkSpacing||10}px;width:100%;margin-top:8px;}
.lq-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:${profile.linkHeight||13}px 20px;border-radius:${btnRadius};text-decoration:none;font-size:14px;font-weight:600;transition:all 0.25s ease;cursor:pointer;border:none;color:#fff;}
.lq-btn-icon{width:18px;height:18px;flex-shrink:0;}
.lq-btn-gradient{background:linear-gradient(135deg,${profile.primaryColor},${profile.accentColor});box-shadow:0 4px 20px ${profile.primaryColor}55;}
.lq-btn-glass{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(10px);}
.lq-btn-neon{background:transparent;color:${profile.primaryColor};border:2px solid ${profile.primaryColor};box-shadow:0 0 12px ${profile.primaryColor}44;}
.lq-btn-solid{background:#fff;color:#0d0d1f;}
.lq-btn-minimal{background:transparent;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.12);}
${btnAnim[profile.buttonAnimation] || ""}
${particleBgCss}
.lq-share-btn{display:flex;align-items:center;gap:8px;margin-top:20px;padding:8px 16px;border-radius:20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);font-size:12px;font-weight:500;cursor:pointer;transition:all .2s;}
.lq-share-btn:hover{background:rgba(255,255,255,0.1);color:#fff;}${scrollAnim}${cursorStyle}`;
}

// ─── Build JS ─────────────────────────────────────────────────────────────────
function buildFullJs(profile: ProfileState): string {
  const isYtMusic = (profile.musicPlatform || "spotify") === "youtubemusic";
  let ytVideoId = "";
  if (isYtMusic && profile.musicUrl) {
    const ytMatch = profile.musicUrl.match(/(?:v=|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/);
    if (ytMatch) ytVideoId = ytMatch[1];
  }

  const ytJs = ytVideoId ? `
(function(){
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  var player;
  var isPlaying = false;
  var progressInterval;

  // Fetch title & artist immediately via oEmbed
  fetch('https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytVideoId}')
    .then(function(res){ return res.json(); })
    .then(function(data){
       if(data && data.title) {
          var titleEl = document.querySelector('.yt-title');
          var artistEl = document.querySelector('.yt-artist');
          if(titleEl) titleEl.textContent = data.title;
          if(artistEl && data.author_name) artistEl.textContent = data.author_name;
       }
    }).catch(function(){});

  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player-target-${ytVideoId}', {
      height: '1',
      width: '1',
      videoId: '${ytVideoId}',
      playerVars: { 'autoplay': 0, 'controls': 0, 'disablekb': 1, 'fs': 0, 'rel': 0, 'playsinline': 1 },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function formatTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);
    return min + ":" + (sec < 10 ? "0" + sec : sec);
  }

  function updateProgress() {
    if(!player || !player.getDuration) return;
    var current = player.getCurrentTime() || 0;
    var duration = player.getDuration() || 0;
    
    var currEl = document.querySelector('.yt-time-current');
    var totEl = document.querySelector('.yt-time-total');
    var barEl = document.querySelector('.yt-progress-bar');
    
    if(currEl) currEl.textContent = formatTime(current);
    if(totEl) totEl.textContent = formatTime(duration);
    if(barEl && duration > 0) {
      barEl.style.width = ((current / duration) * 100) + '%';
    }
  }

  function onPlayerReady(event) {
    var titleEl = document.querySelector('.yt-title');
    if(titleEl && player.getVideoData) {
       var data = player.getVideoData();
       // Only replace if we haven't already fetched it via oembed
       if(data && data.title && titleEl.textContent === 'Memuat Audio...') {
          titleEl.textContent = data.title;
       }
    }
    updateProgress();
    
    var playBtn = document.querySelector('.yt-play-btn');
    if(playBtn) {
      playBtn.addEventListener('click', function() {
        if(isPlaying) { player.pauseVideo(); } else { player.playVideo(); }
      });
    }

    var progContainer = document.querySelector('.yt-progress-container');
    if(progContainer) {
      progContainer.addEventListener('click', function(e) {
        if(!player || !player.getDuration) return;
        var rect = this.getBoundingClientRect();
        var pos = (e.clientX - rect.left) / rect.width;
        player.seekTo(pos * player.getDuration(), true);
        if(!isPlaying) player.playVideo();
      });
    }
  }

  function onPlayerStateChange(event) {
    var iconPlay = document.querySelector('.icon-play');
    var iconPause = document.querySelector('.icon-pause');
    if (event.data == YT.PlayerState.PLAYING) {
      isPlaying = true;
      if(iconPlay) iconPlay.style.display = 'none';
      if(iconPause) iconPause.style.display = 'block';
      progressInterval = setInterval(updateProgress, 500);
    } else {
      isPlaying = false;
      if(iconPlay) iconPlay.style.display = 'block';
      if(iconPause) iconPause.style.display = 'none';
      clearInterval(progressInterval);
      if (event.data == YT.PlayerState.ENDED) {
         player.seekTo(0);
         updateProgress();
      }
    }
  }
})();` : "";

  const countdown = profile.showCountdown && profile.countdownDate ? `
(function(){
  function update(){
    var target=new Date("${profile.countdownDate}").getTime(), now=Date.now(), diff=target-now;
    if(diff<=0){document.getElementById("lq-countdown").innerHTML="<span style='color:#a855f7;font-size:14px'>🎉 Time's up!</span>";return;}
    var d=Math.floor(diff/864e5),h=Math.floor((diff%864e5)/36e5),m=Math.floor((diff%36e5)/6e4),s=Math.floor((diff%6e4)/1e3);
    var $=function(id,v){var el=document.getElementById(id);if(el)el.textContent=String(v).padStart(2,"0");};
    $("lq-cd-d",d);$("lq-cd-h",h);$("lq-cd-m",m);$("lq-cd-s",s);
  }
  update();setInterval(update,1000);
})();` : "";

  const cursor = profile.cursorEffect === "sparkle" ? `
(function(){
  document.addEventListener("mousemove",function(e){
    var s=document.createElement("div");
    s.style.cssText="position:fixed;pointer-events:none;left:"+e.clientX+"px;top:"+e.clientY+"px;width:6px;height:6px;border-radius:50%;background:${profile.primaryColor};animation:lq-spark .6s ease forwards;z-index:99999;transform:translate(-50%,-50%)";
    document.body.appendChild(s);setTimeout(function(){s.remove();},600);
  });
  var style=document.createElement("style");
  style.textContent="@keyframes lq-spark{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(0)}}";
  document.head.appendChild(style);
})();` : "";

  const cursorGlowJs = profile.cursorEffect === "glow" ? `
(function(){
  var glow = document.getElementById("lq-cursor-glow");
  if(glow){
    document.addEventListener("mousemove", function(e){
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
    document.addEventListener("mousedown", function(){
      glow.style.width = "20px";
      glow.style.height = "20px";
    });
    document.addEventListener("mouseup", function(){
      glow.style.width = "30px";
      glow.style.height = "30px";
    });
  }
})();` : "";

  const shareJs = profile.showShareBtn ? `
(function(){
  var btn = document.getElementById("lq-share-btn");
  var txt = document.getElementById("lq-share-text");
  if(btn && txt){
    btn.addEventListener("click", function(){
      var url = window.location.href;
      if (url === "about:srcdoc") {
        url = window.parent.location.href;
      }
      if(navigator.share){
        navigator.share({title:"${profile.name}", url: url});
      } else {
        navigator.clipboard.writeText(url).then(function(){
          var old = txt.textContent;
          txt.textContent = "Copied!";
          btn.style.color = "#4ade80";
          setTimeout(function(){ 
            txt.textContent = old; 
            btn.style.color = "";
          }, 2000);
        });
      }
    });
  }
})();` : "";

  return `// Lingkoraq — ${profile.name}
${ytJs}
${countdown}
${cursor}
${cursorGlowJs}
${shareJs}
console.log("Lingkoraq page loaded ✨");`;
}

// ─── DEFAULT PROFILE ──────────────────────────────────────────────────────────
const DEFAULT_PROFILE: ProfileState = {
  name: "Alex Morgan",
  bio: "Creative Developer & Designer crafting digital experiences that matter.",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
  badgeText: "Available for work",
  badgeColor: "green",
  font: "'Inter', -apple-system, sans-serif",
  bgType: "gradient",
  bgValue: "",
  cardStyle: "glass",
  primaryColor: "#6366f1",
  accentColor: "#a855f7",
  avatarShape: "circle",
  avatarSize: "md",
  avatarGlow: false,
  faviconUrl: "",
  showBadge: true,
  showStats: false,
  statFollowers: "12K",
  statProjects: "48",
  statRating: "5★",
  musicUrl: "",
  showMusic: false,
  musicPlatform: "spotify",
  countdownDate: "",
  showCountdown: false,
  scrollAnimation: "slide",
  buttonRadius: "md",
  buttonAnimation: "lift",
  showShareBtn: true,
  customDomain: "",
  seoTitle: "",
  seoDescription: "",
  ogImage: "",
  verifiedBadge: false,
  darkMode: true,
  cursorEffect: "none",
  pageLayout: "center",
  avatarBorder: "none",
  coloredIcons: true,
  // Custom border
  borderColor1: "#6366f1",
  borderColor2: "#a855f7",
  borderColor3: "#ec4899",
  borderWidth: 4,
  borderSpeed: "normal",
  borderOpacity: 1,
  // Extra customization
  cardBlur: 24,
  cardOpacity: 0.06,
  cardBorderRadius: 28,
  cardBorderColor: "rgba(255,255,255,0.12)",
  cardGlow: false,
  cardGlowColor: "#6366f1",
  bioFontSize: 14,
  nameFontSize: 24,
  linkSpacing: 10,
  linkHeight: 13,
  particleBg: "none",
  showNote: false,
  noteText: "Feeling good today 🎶",
  noteMusicId: "",
  noteMusicTitle: "",
  noteMusicArtist: "",
  noteMusicThumbnail: "",
};

const DEFAULT_LINKS: LinkButton[] = [
  { id: uid(), label: "My Portfolio", url: "#", iconId: "website", style: "gradient", visible: true },
  { id: uid(), label: "GitHub", url: "https://github.com", iconId: "github", style: "glass", visible: true },
  { id: uid(), label: "Instagram", url: "https://instagram.com", iconId: "instagram", style: "glass", visible: true },
];

function freshHtml(profile: ProfileState, links: LinkButton[]) {
  return buildFullHtml(profile, links);
}
function freshCss(profile: ProfileState) {
  return buildFullCss(profile);
}
function freshJs(profile: ProfileState) {
  return buildFullJs(profile);
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      // Profile
      ...DEFAULT_PROFILE,
      // Code
      html: freshHtml(DEFAULT_PROFILE, DEFAULT_LINKS),
      css: freshCss(DEFAULT_PROFILE),
      js: freshJs(DEFAULT_PROFILE),
      // UI
      device: "mobile",
      zoom: 0.85,
      showPreview: true,
      previewKey: 0,
      // Project
      projectId: null,
      slug: "my-profile",
      title: "My Profile",
      isSaving: false,
      lastSaved: null,
      selectedElementId: null,
      // Links
      links: DEFAULT_LINKS,
      // History
      htmlHistory: [],
      htmlFuture: [],
      cssHistory: [],
      cssFuture: [],

      // ── Code setters with history ────────────────────────────────────────
      setHtml: (html) => set((s) => ({
        html,
        htmlHistory: [...s.htmlHistory.slice(-19), s.html],
        htmlFuture: [],
      })),
      setCss: (css) => set((s) => ({
        css,
        cssHistory: [...s.cssHistory.slice(-19), s.css],
        cssFuture: [],
      })),
      setJs: (js) => set({ js }),
      undoHtml: () => {
        const { htmlHistory, html } = get();
        if (!htmlHistory.length) return;
        const prev = htmlHistory[htmlHistory.length - 1];
        set((s) => ({ html: prev, htmlHistory: s.htmlHistory.slice(0,-1), htmlFuture: [html, ...s.htmlFuture] }));
        get().triggerPreview();
      },
      redoHtml: () => {
        const { htmlFuture, html } = get();
        if (!htmlFuture.length) return;
        const next = htmlFuture[0];
        set((s) => ({ html: next, htmlFuture: s.htmlFuture.slice(1), htmlHistory: [...s.htmlHistory, html] }));
        get().triggerPreview();
      },
      undoCss: () => {
        const { cssHistory, css } = get();
        if (!cssHistory.length) return;
        const prev = cssHistory[cssHistory.length - 1];
        set((s) => ({ css: prev, cssHistory: s.cssHistory.slice(0,-1), cssFuture: [css, ...s.cssFuture] }));
        get().triggerPreview();
      },
      redoCss: () => {
        const { cssFuture, css } = get();
        if (!cssFuture.length) return;
        const next = cssFuture[0];
        set((s) => ({ css: next, cssFuture: s.cssFuture.slice(1), cssHistory: [...s.cssHistory, css] }));
        get().triggerPreview();
      },

      // ── Device / zoom / preview ──────────────────────────────────────────
      setDevice: (device) => set({ device }),
      setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),
      togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),
      triggerPreview: () => set((s) => ({ previewKey: s.previewKey + 1 })),

      // ── Project ──────────────────────────────────────────────────────────
      setProjectId: (projectId) => set({ projectId }),
      setSlug: (slug) => set({ slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 50) }),
      setTitle: (title) => set({ title }),
      setIsSaving: (isSaving) => set({ isSaving }),
      setLastSaved: (lastSaved) => set({ lastSaved }),
      setSelectedElementId: (selectedElementId) => set({ selectedElementId }),

      // ── Profile update → IMMEDIATELY rebuild HTML/CSS/JS ─────────────────
      updateProfile: (changes) => {
        set((s) => {
          const newProfile = { ...s, ...changes } as ProfileState;
          const newHtml = buildFullHtml(newProfile, s.links);
          const newCss = buildFullCss(newProfile);
          const newJs = buildFullJs(newProfile);
          return { ...changes, html: newHtml, css: newCss, js: newJs, previewKey: s.previewKey + 1 };
        });
      },

      // ── Links → IMMEDIATELY rebuild HTML ────────────────────────────────
      addLink: (link) => {
        const newLink: LinkButton = { ...link, id: uid() };
        set((s) => {
          const newLinks = [...s.links, newLink];
          const newHtml = buildFullHtml(s as unknown as ProfileState, newLinks);
          return { links: newLinks, html: newHtml, previewKey: s.previewKey + 1 };
        });
      },
      updateLink: (id, changes) => {
        set((s) => {
          const newLinks = s.links.map(l => l.id === id ? { ...l, ...changes } : l);
          const newHtml = buildFullHtml(s as unknown as ProfileState, newLinks);
          return { links: newLinks, html: newHtml, previewKey: s.previewKey + 1 };
        });
      },
      removeLink: (id) => {
        set((s) => {
          const newLinks = s.links.filter(l => l.id !== id);
          const newHtml = buildFullHtml(s as unknown as ProfileState, newLinks);
          return { links: newLinks, html: newHtml, previewKey: s.previewKey + 1 };
        });
      },
      reorderLinks: (links) => {
        set((s) => {
          const newHtml = buildFullHtml(s as unknown as ProfileState, links);
          return { links, html: newHtml, previewKey: s.previewKey + 1 };
        });
      },

      // ── rebuildHtml (called when user edits raw code) ────────────────────
      rebuildHtml: () => {
        const s = get();
        set({ previewKey: s.previewKey + 1 });
      },

      loadProject: (p) => set({
        html: p.html_code,
        css: p.css_code,
        js: p.js_code,
        projectId: p.id,
        slug: p.slug,
        title: p.title,
        lastSaved: new Date(),
        previewKey: Date.now(),
      }),

      resetEditor: () => {
        const links = [
          { id: uid(), label: "My Portfolio", url: "#", iconId: "website", style: "gradient" as const, visible: true },
          { id: uid(), label: "GitHub", url: "https://github.com", iconId: "github", style: "glass" as const, visible: true },
          { id: uid(), label: "Instagram", url: "https://instagram.com", iconId: "instagram", style: "glass" as const, visible: true },
        ];
        set({
          ...DEFAULT_PROFILE,
          links,
          html: buildFullHtml(DEFAULT_PROFILE, links),
          css: buildFullCss(DEFAULT_PROFILE),
          js: buildFullJs(DEFAULT_PROFILE),
          projectId: null,
          slug: "my-profile",
          title: "My Profile",
          previewKey: Date.now(),
          htmlHistory: [],
          htmlFuture: [],
          cssHistory: [],
          cssFuture: [],
        });
      },
    }),
    {
      name: "lingkoraq-editor-v4",
      partialize: (s) => ({
        // Code
        html: s.html, css: s.css, js: s.js,
        // Editor UI
        device: s.device, zoom: s.zoom, showPreview: s.showPreview,
        // Project
        projectId: s.projectId, slug: s.slug, title: s.title,
        // Links
        links: s.links,
        // Profile — identity
        name: s.name, bio: s.bio, avatarUrl: s.avatarUrl, faviconUrl: s.faviconUrl,
        // Badge
        badgeText: s.badgeText, badgeColor: s.badgeColor, showBadge: s.showBadge,
        // Typography & layout
        font: s.font, pageLayout: s.pageLayout,
        bioFontSize: s.bioFontSize, nameFontSize: s.nameFontSize,
        // Background
        bgType: s.bgType, bgValue: s.bgValue,
        // Card
        cardStyle: s.cardStyle, cardBlur: s.cardBlur, cardOpacity: s.cardOpacity,
        cardBorderRadius: s.cardBorderRadius, cardBorderColor: s.cardBorderColor,
        cardGlow: s.cardGlow, cardGlowColor: s.cardGlowColor,
        // Colors
        primaryColor: s.primaryColor, accentColor: s.accentColor,
        // Avatar
        avatarShape: s.avatarShape, avatarSize: s.avatarSize,
        avatarGlow: s.avatarGlow, avatarBorder: s.avatarBorder,
        // Border system
        borderColor1: s.borderColor1, borderColor2: s.borderColor2, borderColor3: s.borderColor3,
        borderWidth: s.borderWidth, borderSpeed: s.borderSpeed, borderOpacity: s.borderOpacity,
        // Particle background
        particleBg: s.particleBg,
        // Icons
        coloredIcons: s.coloredIcons,
        // Stats
        showStats: s.showStats,
        statFollowers: s.statFollowers, statProjects: s.statProjects, statRating: s.statRating,
        // Music
        musicUrl: s.musicUrl, showMusic: s.showMusic, musicPlatform: s.musicPlatform,
        // Countdown
        countdownDate: s.countdownDate, showCountdown: s.showCountdown,
        // Buttons & links
        scrollAnimation: s.scrollAnimation, buttonRadius: s.buttonRadius, buttonAnimation: s.buttonAnimation,
        linkSpacing: s.linkSpacing, linkHeight: s.linkHeight,
        // Share & social
        showShareBtn: s.showShareBtn,
        // SEO / domain
        customDomain: s.customDomain,
        seoTitle: s.seoTitle, seoDescription: s.seoDescription, ogImage: s.ogImage,
        // Misc
        verifiedBadge: s.verifiedBadge, darkMode: s.darkMode,
        cursorEffect: s.cursorEffect, showNote: s.showNote, noteText: s.noteText,
      }),
    }
  )
);
