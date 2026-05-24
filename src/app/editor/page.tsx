"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Save, Eye, EyeOff, Code2, Smartphone, Tablet, Monitor,
  Plus, Trash2, GripVertical, Check, X, ChevronDown, ChevronUp,
  Link2, Upload, Download, RotateCcw, Settings, ExternalLink,
  Image as ImageIcon, ZoomIn, ZoomOut, Sparkles, ArrowLeft,
  ToggleLeft, ToggleRight, Palette, User as UserIcon, Type, Star,
  Music, Clock, Share2, Globe, Copy, Undo2, Redo2, FileCode, Puzzle,
  Search,
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { useSync } from "@/hooks/useSync";
import { LINK_ICONS, ICON_CATEGORIES } from "@/lib/linkIcons";
import { AVATAR_BORDERS } from "@/lib/avatarBorders";
import type { LinkButton } from "@/types";
import { uploadImageToGitHub } from "@/actions/githubStorage";
import { createProject, updateProject, getUserProjects, getProjectById, checkSlugTaken, saveUserProfile, loadUserProfile } from "@/actions/projectActions";
import { compressImageToWebp } from "@/lib/imageCompression";
import { createClientBrowser } from "@/lib/supabaseBrowser";
import type { User } from "@supabase/supabase-js";
import DonationPopup from "@/components/DonationPopup";
import MusicSearchModal from "@/components/MusicSearchModal";
import NoteManager from "@/components/NoteManager";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const DEVICE_SIZES = { mobile:{w:375,h:812}, tablet:{w:768,h:1024}, desktop:{w:1280,h:800} } as const;
const BTN_STYLES = ["gradient","glass","neon","solid","minimal"] as const;
const FONTS = [
  { label:"Inter", value:"'Inter',-apple-system,sans-serif" },
  { label:"Poppins", value:"'Poppins',sans-serif" },
  { label:"Montserrat", value:"'Montserrat',sans-serif" },
  { label:"System", value:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" },
];
const CARD_STYLES = ["glass","solid","minimal","neon"] as const;
const BG_TYPES = ["gradient","solid","mesh"] as const;
const AVATAR_SHAPES = ["circle","rounded","square"] as const;
const AVATAR_SIZES = ["sm","md","lg","xl"] as const;
const BTN_RADII = ["sm","md","lg","full"] as const;
const BTN_ANIMS = ["none","lift","glow","scale"] as const;
const SCROLL_ANIMS = ["none","fade","slide","zoom"] as const;
const CURSOR_EFFECTS = ["none","glow","sparkle"] as const;
const PAGE_LAYOUTS = ["center","left","wide"] as const;
const BADGE_COLORS = ["green","blue","purple","red","none"] as const;

type PanelId = "profile"|"links"|"style"|"features"|"code"|"settings";

// ─── Mini components ──────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on?"bg-blue-500":"bg-white/10"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${on?"translate-x-4":""}`} />
    </button>
  );
}

function Swatch({ color, onPick, label }: { color: string; onPick: (c:string)=>void; label:string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-white/40 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={color} onChange={e=>onPick(e.target.value)}
          className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5" />
        <span className="text-xs text-white/50 font-mono">{color}</span>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs text-white/60 flex-shrink-0">{label}</label>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  );
}

function PillGroup({ options, value, onChange }: { options: readonly string[]; value: string; onChange: (v:string)=>void }) {
  return (
    <div className="flex gap-1 flex-wrap justify-end">
      {options.map(o=>(
        <button key={o} onClick={()=>onChange(o)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all ${value===o?"bg-blue-500/25 text-blue-300 border border-blue-500/30":"bg-white/5 text-white/40 hover:bg-white/10 border border-transparent"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function IconPicker({ current, onSelect }: { current: string; onSelect: (id:string)=>void }) {
  const [cat, setCat] = useState("all");
  const icons = cat==="all" ? LINK_ICONS : LINK_ICONS.filter(i=>i.category===cat);
  return (
    <div className="space-y-2">
      <div className="flex gap-1 flex-wrap">
        <button onClick={()=>setCat("all")} className={`px-2 py-0.5 rounded text-[10px] font-medium ${cat==="all"?"bg-blue-500/25 text-blue-300":"bg-white/5 text-white/40 hover:bg-white/10"}`}>All</button>
        {ICON_CATEGORIES.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${cat===c.id?"bg-blue-500/25 text-blue-300":"bg-white/5 text-white/40 hover:bg-white/10"}`}>{c.emoji}</button>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 max-h-28 overflow-y-auto custom-scrollbar">
        {icons.map(icon=>(
          <button key={icon.id} onClick={()=>onSelect(icon.id)} title={icon.label}
            className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${current===icon.id?"bg-blue-500/25 ring-1 ring-blue-500/50":"bg-white/5 hover:bg-white/10"}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"
              style={{color:["#000000","#010101","#181717"].includes(icon.color)?"rgba(255,255,255,0.7)":icon.color}}
              dangerouslySetInnerHTML={{__html:icon.svg}} />
          </button>
        ))}
      </div>
    </div>
  );
}

function LinkCard({ link, onUpdate, onRemove }: { link: LinkButton; onUpdate:(id:string,c:Partial<LinkButton>)=>void; onRemove:(id:string)=>void }) {
  const [open, setOpen] = useState(false);
  const icon = LINK_ICONS.find(i=>i.id===link.iconId);
  return (
    <div className={`rounded-xl border transition-all ${link.visible?"border-blue-900/30 bg-blue-950/20":"border-white/5 bg-white/[0.02] opacity-50"}`}>
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical className="w-3.5 h-3.5 text-white/20 cursor-grab flex-shrink-0" />
        {icon && <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0"
          style={{color:["#000","#010101","#181717"].includes(icon.color)?"rgba(255,255,255,0.6)":icon.color}}
          dangerouslySetInnerHTML={{__html:icon.svg}} />}
        <span className="text-xs text-white/80 flex-1 truncate font-medium">{link.label||"Untitled"}</span>
        <Toggle on={link.visible} onToggle={()=>onUpdate(link.id,{visible:!link.visible})} />
        <button onClick={()=>setOpen(!open)} className="p-1 rounded hover:bg-white/10">
          {open?<ChevronUp className="w-3 h-3 text-white/40"/>:<ChevronDown className="w-3 h-3 text-white/40"/>}
        </button>
        <button onClick={()=>onRemove(link.id)} className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400">
          <Trash2 className="w-3 h-3"/>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
            <div className="px-3 pb-3 pt-2 border-t border-white/5 space-y-2">
              <input value={link.label} onChange={e=>onUpdate(link.id,{label:e.target.value})} placeholder="Label"
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"/>
              <input value={link.url} onChange={e=>onUpdate(link.id,{url:e.target.value})} placeholder="https://..."
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"/>
              <div>
                <p className="text-[10px] text-white/40 mb-1">Style</p>
                <PillGroup options={BTN_STYLES} value={link.style} onChange={v=>onUpdate(link.id,{style:v as LinkButton["style"]})} />
              </div>
              <div>
                <p className="text-[10px] text-white/40 mb-1">Icon</p>
                <IconPicker current={link.iconId} onSelect={id=>onUpdate(link.id,{iconId:id})} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function EditorPage() {
  const store = useEditorStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [panel, setPanel] = useState<PanelId>("profile");
  const [codeTab, setCodeTab] = useState<"html"|"css"|"js">("html");
  const [user, setUser] = useState<User | null>(null);
  const [saveStatus, setSaveStatus] = useState<""|"saving"|"saved"|"error">("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [addingLink, setAddingLink] = useState(false);
  const [selectedEl, setSelectedEl] = useState<{id:string;tag:string}|null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIconId, setNewIconId] = useState("link");
  const [newStyle, setNewStyle] = useState<LinkButton["style"]>("glass");
  const [uploadTarget, setUploadTarget] = useState<"avatar"|"favicon">("avatar");
  const [slugStatus, setSlugStatus] = useState<"idle"|"loading"|"available"|"taken">("idle");
  const [domain, setDomain] = useState("lingkoraq.vercel.app");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const htmlImportRef = useRef<HTMLInputElement>(null);

  // ── AUTO-SYNC: Load profile + latest project from DB on login ──────────────
  useEffect(() => {
    if (typeof window !== "undefined") setDomain(window.location.host);
    createClientBrowser().auth.getUser()
      .then(async ({data}) => {
        if (!data.user) { window.location.href = "/login"; return; }
        setUser(data.user);

        // Load from DB — syncs across all devices
        const { success, data: profileData, latestProjectId } = await loadUserProfile();

        if (success && profileData && Object.keys(profileData).length > 0) {
          // Restore profile state (name, bio, colors, links, etc.)
          store.updateProfile(profileData as any);
        }

        if (success && latestProjectId && !store.projectId) {
          // Auto-load most recent project
          const { success: pSuccess, project } = await getProjectById(latestProjectId);
          if (pSuccess && project) {
            store.loadProject(project);
          }
        }
      })
      .catch(() => {
        window.location.href = "/login";
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getCleanHtml } = useSync(iframeRef, {
    onElementClick: (id, tag) => setSelectedEl({id, tag}),
  });

  // ── PROFILE SYNC HELPER ─────────────────────────────────────────────────────
  // Extracts ALL profile fields from store and saves to Supabase user_profiles
  const syncProfileToDB = async () => {
    try {
      const s = store;
      const profileSnapshot = {
        // Identity
        name: s.name, bio: s.bio, avatarUrl: s.avatarUrl, faviconUrl: s.faviconUrl,
        // Badge
        badgeText: s.badgeText, badgeColor: s.badgeColor, showBadge: s.showBadge,
        // Typography & layout
        font: s.font, pageLayout: s.pageLayout,
        bioFontSize: s.bioFontSize, nameFontSize: s.nameFontSize,
        // Background
        bgType: s.bgType, bgValue: s.bgValue,
        // Particle background
        particleBg: s.particleBg,
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
        cursorEffect: s.cursorEffect,
        // Notes
        showNote: s.showNote, noteText: s.noteText,
        noteMusicId: s.noteMusicId, noteMusicTitle: s.noteMusicTitle,
        noteMusicArtist: s.noteMusicArtist, noteMusicThumbnail: s.noteMusicThumbnail,
        // Links & project ref
        links: s.links, slug: s.slug, title: s.title, projectId: s.projectId,
      };
      await saveUserProfile(profileSnapshot);
    } catch (err) {
      console.warn("Profile sync failed (non-critical):", err);
    }
  };

  // Save
  const handleSave = async () => {
    if (!user) return;
    setSaveStatus("saving");
    setSaveError(null);
    store.setIsSaving(true);
    try {
      const clean = getCleanHtml();
      if (store.projectId) {
        const { success, error } = await updateProject(store.projectId, { html_code: clean, css_code: store.css, js_code: store.js, slug: store.slug, title: store.name, favicon_url: store.faviconUrl });
        if (!success) throw new Error(error || "Update failed");
        setSaveStatus("saved");
        store.setLastSaved(new Date());
        // Sync profile to DB for cross-device sync
        await syncProfileToDB();
      } else {
        const { success, project, error } = await createProject({ slug: store.slug || "my-page", title: store.name || "Untitled", html_code: clean, css_code: store.css, js_code: store.js, favicon_url: store.faviconUrl });
        if (!success) throw new Error(error || "Create failed");
        if (project) {
          store.setProjectId(project.id);
          setSaveStatus("saved");
          store.setLastSaved(new Date());
          // Sync profile to DB for cross-device sync
          await syncProfileToDB();
        }
      }
    } catch (err: any) {
      console.error("Save failed:", err);
      setSaveStatus("error");
      setSaveError(err.message || "Save failed. Check console for details.");
    } finally {
      store.setIsSaving(false);
      setTimeout(() => { setSaveStatus(""); setSaveError(null); }, 4000);
    }
  };

  // Add link
  const handleAddLink = () => {
    if (!newLabel.trim()) return;
    store.addLink({label:newLabel, url:newUrl||"#", iconId:newIconId, style:newStyle, visible:true});
    setNewLabel(""); setNewUrl(""); setNewIconId("link"); setNewStyle("glass");
    setAddingLink(false);
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedWebpBase64 = await compressImageToWebp(file, 800, 0.8);
      const webpFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
      const result = await uploadImageToGitHub(compressedWebpBase64, webpFileName);
      if (result.success && result.url) {
        if (uploadTarget === "avatar") {
          store.updateProfile({ avatarUrl: result.url });
        } else if (uploadTarget === "favicon") {
          store.updateProfile({ faviconUrl: result.url });
        }
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (err: any) {
      alert("Failed to compress or upload image: " + err.message);
    } finally {
      setUploading(false); setShowUploader(false);
    }
  };

  const verifySlugStatus = async () => {
    if (!store.slug) return;
    setSlugStatus("loading");
    const taken = await checkSlugTaken(store.slug);
    // If it's already their own project's slug, it shouldn't show as "taken" but wait,
    // they can just save to find out, or we can just say "available" if it's theirs!
    // Since checkSlugTaken just tests global presence, we will just use it to hint.
    setSlugStatus(taken ? "taken" : "available");
  };

  const randomizeSlug = () => {
    store.setSlug(`page-${Math.random().toString(36).slice(2,8)}`);
    setSlugStatus("idle");
  };

  // Export
  const handleExport = () => {
    const blob = new Blob([`<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width,initial-scale=1.0">\n<title>${store.title}</title>\n<style>${store.css}</style>\n</head>\n<body>\n${getCleanHtml()}\n<script>${store.js}<\/script>\n</body>\n</html>`], {type:"text/html"});
    const a = Object.assign(document.createElement("a"), {href:URL.createObjectURL(blob), download:`${store.slug||"page"}.html`});
    a.click(); URL.revokeObjectURL(a.href);
  };

  const size = DEVICE_SIZES[store.device];
  const up = (changes: Parameters<typeof store.updateProfile>[0]) => store.updateProfile(changes);

  const PANELS: {id:PanelId; icon:any; label:string}[] = [
    {id:"profile", icon:UserIcon, label:"Profile"},
    {id:"links", icon:Link2, label:"Links"},
    {id:"style", icon:Palette, label:"Style"},
    {id:"features", icon:Sparkles, label:"Features"},
    {id:"code", icon:Code2, label:"Code"},
    {id:"settings", icon:Settings, label:"Settings"},
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#020817] overflow-hidden">

      {/* ── TOPBAR ─────────────────────────────────────────────────── */}
      <div className="h-12 border-b border-blue-900/30 bg-[#030e22]/80 backdrop-blur-xl flex items-center px-2 gap-1.5 flex-shrink-0">
        <Link href="/" className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors flex-shrink-0"><ArrowLeft className="w-4 h-4"/></Link>
        <div className="h-4 w-px bg-white/10 flex-shrink-0"/>
        <input value={store.title} onChange={e=>store.setTitle(e.target.value)}
          className="hidden sm:block w-36 px-2 py-1 rounded-lg bg-white/5 border border-white/[0.08] text-xs text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/50 transition-colors"
          placeholder="Page title"/>
        <div className="flex-1"/>

        {/* Undo/Redo */}
        <button onClick={store.undoHtml} disabled={!store.htmlHistory.length} title="Undo" className="p-1.5 rounded-lg hover:bg-blue-500/10 text-white/30 hover:text-blue-300 transition-colors disabled:opacity-30"><Undo2 className="w-3.5 h-3.5"/></button>
        <button onClick={store.redoHtml} disabled={!store.htmlFuture.length} title="Redo" className="p-1.5 rounded-lg hover:bg-blue-500/10 text-white/30 hover:text-blue-300 transition-colors disabled:opacity-30"><Redo2 className="w-3.5 h-3.5"/></button>

        {/* Preview toggle */}
        <button onClick={()=>store.togglePreview()}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${store.showPreview?"bg-blue-500/20 text-blue-300 border border-blue-500/25":"bg-white/5 text-white/40 hover:bg-white/10"}`}>
          {store.showPreview?<Eye className="w-3.5 h-3.5"/>:<EyeOff className="w-3.5 h-3.5"/>}
          <span className="hidden md:inline">{store.showPreview?"On":"Off"}</span>
        </button>

        {/* Device */}
        <div className="hidden sm:flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5">
          {(["mobile","tablet","desktop"] as const).map(d=>(
            <button key={d} onClick={()=>store.setDevice(d)} title={d}
              className={`p-1.5 rounded-md transition-colors ${store.device===d?"bg-blue-500/20 text-blue-300":"text-white/30 hover:text-white/60"}`}>
              {d==="mobile"&&<Smartphone className="w-3.5 h-3.5"/>}
              {d==="tablet"&&<Tablet className="w-3.5 h-3.5"/>}
              {d==="desktop"&&<Monitor className="w-3.5 h-3.5"/>}
            </button>
          ))}
        </div>

        {/* Save */}
        <motion.button onClick={handleSave} disabled={store.isSaving}
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20">
          <Save className="w-3.5 h-3.5"/>
          <span className="hidden sm:inline">{store.isSaving?"Saving…":"Save"}</span>
        </motion.button>
        {saveStatus==="saved"&&<motion.span initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} className="text-xs text-emerald-400 font-medium">✓ Saved</motion.span>}
        {saveStatus==="error"&&<span className="text-xs text-red-400" title={saveError ?? ""}>Error! {saveError ? `(${saveError})` : ""}</span>}
      </div>

      {/* ── BODY ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── PANEL SIDEBAR ─────────────────────────────────────── */}
        <div className="w-[280px] md:w-[300px] flex-shrink-0 flex flex-col border-r border-blue-900/20 bg-[#030e22]/70 backdrop-blur-xl overflow-hidden">
          {/* Panel tabs */}
          <div className="grid grid-cols-6 border-b border-blue-900/20 flex-shrink-0">
            {PANELS.map(({id,icon:Icon,label})=>(
              <button key={id} onClick={()=>setPanel(id)} title={label}
                className={`relative flex flex-col items-center py-2.5 gap-0.5 text-[9px] font-medium transition-all duration-200 ${
                  panel===id?"text-blue-300":"text-white/30 hover:text-white/60"
                }`}>
                {panel===id && (
                  <motion.span layoutId="panel-tab-indicator" className="absolute bottom-0 left-1 right-1 h-0.5 rounded-t bg-gradient-to-r from-blue-500 to-cyan-400" />
                )}
                <Icon className="w-3.5 h-3.5"/>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* ── PROFILE PANEL ── */}
          {panel==="profile" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Profile</p>

              {/* Avatar */}
              <div className="flex flex-col items-center gap-2 pb-3 border-b border-white/5">
                <div className="relative group">
                  <img src={store.avatarUrl} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/40"/>
                  <button onClick={()=>setShowUploader(true)}
                    className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-4 h-4 text-white"/>
                  </button>
                </div>
                <input value={store.avatarUrl} onChange={e=>up({avatarUrl:e.target.value})} placeholder="Avatar URL"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                <input value={store.faviconUrl} onChange={e=>up({faviconUrl:e.target.value})} placeholder="Favicon URL (https://...)"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
              </div>

              <input value={store.name} onChange={e=>up({name:e.target.value})} placeholder="Your name"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-medium focus:outline-none focus:border-indigo-500/50"/>
              <textarea value={store.bio} onChange={e=>up({bio:e.target.value})} placeholder="Your bio..." rows={3}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white resize-none focus:outline-none focus:border-indigo-500/50"/>

              {/* Avatar Border */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <label className="text-[10px] text-white/40 uppercase tracking-widest block">Avatar Border</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-1">
                  {AVATAR_BORDERS.map(b => (
                    <button key={b.id} onClick={() => up({ avatarBorder: b.id })}
                      className={`px-2 py-1.5 rounded-lg text-[10px] text-left transition-all border ${store.avatarBorder === b.id ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300" : "bg-white/5 border-transparent text-white/50 hover:bg-white/10"}`}>
                      {b.name}
                    </button>
                  ))}
                </div>

                {/* Custom Border Colors */}
                <div className="space-y-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Custom Border Colors</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Primary", key: "borderColor1" as const, val: store.borderColor1 },
                      { label: "Accent", key: "borderColor2" as const, val: store.borderColor2 },
                      { label: "Third", key: "borderColor3" as const, val: store.borderColor3 },
                    ].map(c => (
                      <div key={c.key} className="flex flex-col gap-1">
                        <label className="text-[9px] text-white/30">{c.label}</label>
                        <div className="flex items-center gap-1">
                          <input type="color" value={c.val || "#6366f1"} onChange={e => up({ [c.key]: e.target.value })}
                            className="w-7 h-7 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5 flex-shrink-0" />
                          <span className="text-[9px] text-white/30 font-mono truncate">{c.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Row label="Speed">
                    <PillGroup options={["slow","normal","fast","ultra"] as const} value={store.borderSpeed || "normal"} onChange={v => up({ borderSpeed: v })} />
                  </Row>
                  <Row label="Width">
                    <input type="range" min="1" max="8" step="1" value={store.borderWidth || 4}
                      onChange={e => up({ borderWidth: parseInt(e.target.value) })}
                      className="w-24 accent-indigo-500" />
                  </Row>
                  <Row label="Opacity">
                    <input type="range" min="0.2" max="1" step="0.05" value={store.borderOpacity ?? 1}
                      onChange={e => up({ borderOpacity: parseFloat(e.target.value) })}
                      className="w-24 accent-indigo-500" />
                  </Row>
                </div>
              </div>

              {/* Badge */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <Row label="Show Badge"><Toggle on={store.showBadge} onToggle={()=>up({showBadge:!store.showBadge})}/></Row>
                {store.showBadge && <>
                  <input value={store.badgeText} onChange={e=>up({badgeText:e.target.value})} placeholder="Badge text"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                  <Row label="Color"><PillGroup options={BADGE_COLORS} value={store.badgeColor} onChange={v=>up({badgeColor:v})}/></Row>
                </>}
              </div>

              {/* Avatar options */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Avatar</p>
                <Row label="Shape"><PillGroup options={AVATAR_SHAPES} value={store.avatarShape} onChange={v=>up({avatarShape:v})}/></Row>
                <Row label="Size"><PillGroup options={AVATAR_SIZES} value={store.avatarSize} onChange={v=>up({avatarSize:v})}/></Row>
                <Row label="Glow"><Toggle on={store.avatarGlow} onToggle={()=>up({avatarGlow:!store.avatarGlow})}/></Row>
                <Row label="Colored Icons"><Toggle on={store.coloredIcons} onToggle={()=>up({coloredIcons:!store.coloredIcons})}/></Row>
                <Row label="Verified ✓"><Toggle on={store.verifiedBadge} onToggle={()=>up({verifiedBadge:!store.verifiedBadge})}/></Row>
              </div>

              {/* Layout */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Layout</p>
                <Row label="Page"><PillGroup options={PAGE_LAYOUTS} value={store.pageLayout} onChange={v=>up({pageLayout:v})}/></Row>
              </div>
            </div>
          )}

          {/* ── LINKS PANEL ── */}
          {panel==="links" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Links ({store.links.length})</p>
                <button onClick={()=>setAddingLink(!addingLink)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all">
                  {addingLink?<><X className="w-3 h-3"/>Cancel</>:<><Plus className="w-3 h-3"/>Add</>}
                </button>
              </div>

              <AnimatePresence>
                {addingLink && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                    <div className="bg-blue-500/[0.07] border border-blue-500/20 rounded-xl p-3 space-y-2 mb-1">
                      <input value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="Label (e.g. My Portfolio)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"/>
                      <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"/>
                      <div><p className="text-[10px] text-white/40 mb-1">Style</p>
                        <PillGroup options={BTN_STYLES} value={newStyle} onChange={v=>setNewStyle(v as LinkButton["style"])}/></div>
                      <div><p className="text-[10px] text-white/40 mb-1">Icon</p>
                        <IconPicker current={newIconId} onSelect={setNewIconId}/></div>
                      <button onClick={handleAddLink}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:from-blue-500 hover:to-cyan-400 transition-all">
                        <Check className="w-3.5 h-3.5"/>Add Button
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Reorder.Group axis="y" values={store.links} onReorder={store.reorderLinks} className="space-y-2">
                {store.links.map(link=>(
                  <Reorder.Item key={link.id} value={link} className="cursor-default">
                    <LinkCard link={link} onUpdate={store.updateLink} onRemove={store.removeLink}/>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              {store.links.length===0 && <div className="text-center py-8"><Link2 className="w-8 h-8 text-white/10 mx-auto mb-2"/><p className="text-xs text-white/30">No links yet</p></div>}

              {/* Button options */}
              <div className="pt-3 space-y-2 border-t border-white/5">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Button Style</p>
                <Row label="Radius"><PillGroup options={BTN_RADII} value={store.buttonRadius} onChange={v=>up({buttonRadius:v})}/></Row>
                <Row label="Animation"><PillGroup options={BTN_ANIMS} value={store.buttonAnimation} onChange={v=>up({buttonAnimation:v})}/></Row>
                <Row label="Gap">
                  <div className="flex items-center gap-2">
                    <input type="range" min="4" max="24" step="2" value={store.linkSpacing || 10}
                      onChange={e => up({ linkSpacing: parseInt(e.target.value) })}
                      className="w-20 accent-indigo-500" />
                    <span className="text-[10px] text-white/30 w-6">{store.linkSpacing || 10}</span>
                  </div>
                </Row>
                <Row label="Height">
                  <div className="flex items-center gap-2">
                    <input type="range" min="8" max="22" step="1" value={store.linkHeight || 13}
                      onChange={e => up({ linkHeight: parseInt(e.target.value) })}
                      className="w-20 accent-indigo-500" />
                    <span className="text-[10px] text-white/30 w-6">{store.linkHeight || 13}</span>
                  </div>
                </Row>
              </div>
            </div>
          )}

          {/* ── STYLE PANEL ── */}
          {panel==="style" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Colors</p>
              <Swatch color={store.primaryColor} onPick={v=>up({primaryColor:v})} label="Primary"/>
              <Swatch color={store.accentColor} onPick={v=>up({accentColor:v})} label="Accent"/>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Background</p>
                <Row label="Type"><PillGroup options={BG_TYPES} value={store.bgType} onChange={v=>up({bgType:v})}/></Row>
                {store.bgType==="gradient" && (
                  <div>
                    <label className="text-[10px] text-white/40 mb-1 block">Custom Gradient CSS</label>
                    <input value={store.bgValue} onChange={e=>up({bgValue:e.target.value})}
                      placeholder="linear-gradient(135deg, #0d0d1f, #1a0533)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Card</p>
                <Row label="Style"><PillGroup options={CARD_STYLES} value={store.cardStyle} onChange={v=>up({cardStyle:v})}/></Row>
              </div>

              {/* Card Deep Customization */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Card Deep Settings</p>
                <Row label="Blur">
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="40" step="2" value={store.cardBlur ?? 24}
                      onChange={e => up({ cardBlur: parseInt(e.target.value) })}
                      className="w-20 accent-indigo-500" />
                    <span className="text-[10px] text-white/30 w-6">{store.cardBlur ?? 24}</span>
                  </div>
                </Row>
                <Row label="Opacity">
                  <div className="flex items-center gap-2">
                    <input type="range" min="0.02" max="0.3" step="0.01" value={store.cardOpacity ?? 0.06}
                      onChange={e => up({ cardOpacity: parseFloat(e.target.value) })}
                      className="w-20 accent-indigo-500" />
                    <span className="text-[10px] text-white/30 w-8">{((store.cardOpacity ?? 0.06) * 100).toFixed(0)}%</span>
                  </div>
                </Row>
                <Row label="Radius">
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="48" step="2" value={store.cardBorderRadius ?? 28}
                      onChange={e => up({ cardBorderRadius: parseInt(e.target.value) })}
                      className="w-20 accent-indigo-500" />
                    <span className="text-[10px] text-white/30 w-6">{store.cardBorderRadius ?? 28}</span>
                  </div>
                </Row>
                <Row label="Border Color">
                  <div className="flex items-center gap-2">
                    <input type="color" value={store.cardBorderColor?.startsWith('#') ? store.cardBorderColor : "#ffffff"}
                      onChange={e => up({ cardBorderColor: e.target.value + "20" })}
                      className="w-7 h-7 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5" />
                    <span className="text-[9px] text-white/30 font-mono">custom</span>
                  </div>
                </Row>
                <Row label="Outer Glow"><Toggle on={store.cardGlow ?? false} onToggle={() => up({ cardGlow: !store.cardGlow })} /></Row>
                {store.cardGlow && (
                  <Row label="Glow Color">
                    <div className="flex items-center gap-2">
                      <input type="color" value={store.cardGlowColor || store.primaryColor}
                        onChange={e => up({ cardGlowColor: e.target.value })}
                        className="w-7 h-7 rounded-lg border border-white/10 cursor-pointer bg-transparent p-0.5" />
                    </div>
                  </Row>
                )}
              </div>

              {/* Particle Background */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Particle Background</p>
                <PillGroup options={["none","dots","grid","stars","bubbles","matrix"] as const} value={store.particleBg || "none"} onChange={v => up({ particleBg: v })} />
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Typography</p>
                <div className="grid grid-cols-2 gap-1">
                  {FONTS.map(f=>(
                    <button key={f.value} onClick={()=>up({font:f.value})}
                      className={`px-2 py-1.5 rounded-lg text-xs text-left transition-all ${store.font===f.value?"bg-indigo-500/25 text-indigo-300 border border-indigo-500/30":"bg-white/5 text-white/50 hover:bg-white/10 border border-transparent"}`}
                      style={{fontFamily:f.value}}>{f.label}</button>
                  ))}
                </div>
                <Row label="Name Size">
                  <div className="flex items-center gap-2">
                    <input type="range" min="16" max="40" step="1" value={store.nameFontSize || 24}
                      onChange={e => up({ nameFontSize: parseInt(e.target.value) })}
                      className="w-20 accent-indigo-500" />
                    <span className="text-[10px] text-white/30 w-6">{store.nameFontSize || 24}</span>
                  </div>
                </Row>
                <Row label="Bio Size">
                  <div className="flex items-center gap-2">
                    <input type="range" min="11" max="20" step="1" value={store.bioFontSize || 14}
                      onChange={e => up({ bioFontSize: parseInt(e.target.value) })}
                      className="w-20 accent-indigo-500" />
                    <span className="text-[10px] text-white/30 w-6">{store.bioFontSize || 14}</span>
                  </div>
                </Row>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Animation</p>
                <Row label="Page Entry"><PillGroup options={SCROLL_ANIMS} value={store.scrollAnimation} onChange={v=>up({scrollAnimation:v})}/></Row>
                <Row label="Cursor FX"><PillGroup options={CURSOR_EFFECTS} value={store.cursorEffect} onChange={v=>up({cursorEffect:v})}/></Row>
              </div>
            </div>
          )}

          {/* ── FEATURES PANEL (30 unique features) ── */}
          {panel==="features" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Power Features</p>

              {/* Stats widget */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <Row label="📊 Stats Widget"><Toggle on={store.showStats} onToggle={()=>up({showStats:!store.showStats})}/></Row>
                {store.showStats && <>
                  <input value={store.statFollowers} onChange={e=>up({statFollowers:e.target.value})} placeholder="Followers (e.g. 12K)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                  <input value={store.statProjects} onChange={e=>up({statProjects:e.target.value})} placeholder="Projects (e.g. 48)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                  <input value={store.statRating} onChange={e=>up({statRating:e.target.value})} placeholder="Rating (e.g. 5★)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                </>}
              </div>

              {/* Profile Note */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <Row label="💬 Profile Note"><Toggle on={store.showNote} onToggle={()=>up({showNote:!store.showNote})}/></Row>
                {store.showNote && (
                  <NoteManager />
                )}
              </div>

              {/* Music Player */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <Row label="🎵 Music Player"><Toggle on={store.showMusic} onToggle={()=>up({showMusic:!store.showMusic})}/></Row>
                {store.showMusic && (
                  <div className="space-y-2 pt-1">
                    {/* Platform Selector */}
                    <div className="flex gap-1">
                      {([
                        { id: "spotify", label: "🎧 Spotify" },
                        { id: "youtubemusic", label: "▶ YT Music" },
                      ] as const).map(p => (
                        <button key={p.id} onClick={() => up({ musicPlatform: p.id, musicUrl: "" })}
                          className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${(store.musicPlatform || "spotify") === p.id ? "bg-blue-500/25 text-blue-300 border border-blue-500/30" : "bg-white/5 text-white/40 hover:bg-white/10 border border-transparent"}`}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={store.musicUrl} onChange={e=>up({musicUrl:e.target.value})}
                        placeholder={(store.musicPlatform || "spotify") === "youtubemusic"
                          ? "https://music.youtube.com/watch?v=..."
                          : "https://open.spotify.com/track/..."}
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"/>
                      <button onClick={() => setShowSearchModal(true)} className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap">
                        <Search className="w-3.5 h-3.5" />
                        Search
                      </button>
                    </div>
                    <p className="text-[10px] text-white/25 leading-relaxed">
                      {(store.musicPlatform || "spotify") === "youtubemusic"
                        ? "Search or paste YouTube Music link"
                        : "Paste Spotify share link (track, album, or playlist)"}
                    </p>
                  </div>
                )}
              </div>

              {/* Countdown Timer */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <Row label="⏱ Countdown Timer"><Toggle on={store.showCountdown} onToggle={()=>up({showCountdown:!store.showCountdown})}/></Row>
                {store.showCountdown && (
                  <input type="datetime-local" value={store.countdownDate} onChange={e=>up({countdownDate:e.target.value})}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                )}
              </div>

              {/* Share Button */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <Row label="🔗 Share Button"><Toggle on={store.showShareBtn} onToggle={()=>up({showShareBtn:!store.showShareBtn})}/></Row>
              </div>

              {/* Verified badge */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <Row label="✅ Verified Badge"><Toggle on={store.verifiedBadge} onToggle={()=>up({verifiedBadge:!store.verifiedBadge})}/></Row>
              </div>

              {/* Avatar Glow */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <Row label="✨ Avatar Glow Effect"><Toggle on={store.avatarGlow} onToggle={()=>up({avatarGlow:!store.avatarGlow})}/></Row>
              </div>

              {/* Favicon URL */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">🌐 Custom Favicon URL</p>
                <div className="flex items-center gap-2">
                  <input value={store.faviconUrl} onChange={e=>up({faviconUrl:e.target.value})} placeholder="https://example.com/favicon.ico"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                  <button onClick={()=>{setUploadTarget("favicon"); fileInputRef.current?.click();}} className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
                    Upload
                  </button>
                </div>
              </div>

              {/* Cursor effect */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">🖱️ Cursor Effect</p>
                <PillGroup options={CURSOR_EFFECTS} value={store.cursorEffect} onChange={v=>up({cursorEffect:v})}/>
              </div>

              {/* Page animation */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">🎬 Page Entry Animation</p>
                <PillGroup options={SCROLL_ANIMS} value={store.scrollAnimation} onChange={v=>up({scrollAnimation:v})}/>
              </div>

              {/* Page layout */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">📐 Page Layout</p>
                <PillGroup options={PAGE_LAYOUTS} value={store.pageLayout} onChange={v=>up({pageLayout:v})}/>
              </div>

              {/* Avatar size */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">🖼️ Avatar Size</p>
                <PillGroup options={AVATAR_SIZES} value={store.avatarSize} onChange={v=>up({avatarSize:v})}/>
              </div>

              {/* Avatar shape */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">⬛ Avatar Shape</p>
                <PillGroup options={AVATAR_SHAPES} value={store.avatarShape} onChange={v=>up({avatarShape:v})}/>
              </div>

              {/* Card style */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">🃏 Card Style</p>
                <PillGroup options={CARD_STYLES} value={store.cardStyle} onChange={v=>up({cardStyle:v})}/>
              </div>

              {/* Button radius */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">🔘 Button Radius</p>
                <PillGroup options={BTN_RADII} value={store.buttonRadius} onChange={v=>up({buttonRadius:v})}/>
              </div>

              {/* Button animation */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] space-y-2">
                <p className="text-xs text-white/60 font-medium">💫 Button Hover Effect</p>
                <PillGroup options={BTN_ANIMS} value={store.buttonAnimation} onChange={v=>up({buttonAnimation:v})}/>
              </div>
            </div>
          )}

          {/* ── CODE PANEL ── */}
          {panel==="code" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-1 px-2">
                  <button onClick={store.undoHtml} disabled={!store.htmlHistory.length} className="p-1 rounded hover:bg-white/10 disabled:opacity-30"><Undo2 className="w-3 h-3 text-white/50"/></button>
                  <button onClick={store.redoHtml} disabled={!store.htmlFuture.length} className="p-1 rounded hover:bg-white/10 disabled:opacity-30"><Redo2 className="w-3 h-3 text-white/50"/></button>
                </div>
                {(["html","css","js"] as const).map(t=>(
                  <button key={t} onClick={()=>setCodeTab(t)}
                    className={`flex-1 py-2 text-[11px] font-medium uppercase tracking-wide transition-colors ${codeTab===t?"text-blue-300 border-b-2 border-blue-500":"text-white/30 hover:text-white/60"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                {codeTab==="html"&&<MonacoEditor height="100%" defaultLanguage="html" value={store.html} theme="vs-dark"
                  options={{minimap:{enabled:false},fontSize:12,wordWrap:"on",automaticLayout:true,scrollBeyondLastLine:false,padding:{top:8}}}
                  onChange={v=>{store.setHtml(v||"");store.triggerPreview();}}/>}
                {codeTab==="css"&&<MonacoEditor height="100%" defaultLanguage="css" value={store.css} theme="vs-dark"
                  options={{minimap:{enabled:false},fontSize:12,wordWrap:"on",automaticLayout:true,scrollBeyondLastLine:false,padding:{top:8}}}
                  onChange={v=>{store.setCss(v||"");store.triggerPreview();}}/>}
                {codeTab==="js"&&<MonacoEditor height="100%" defaultLanguage="javascript" value={store.js} theme="vs-dark"
                  options={{minimap:{enabled:false},fontSize:12,wordWrap:"on",automaticLayout:true,scrollBeyondLastLine:false,padding:{top:8}}}
                  onChange={v=>{store.setJs(v||"");store.triggerPreview();}}/>}
              </div>
            </div>
          )}

          {/* ── SETTINGS PANEL ── */}
          {panel==="settings" && (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Project Settings</p>

              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-widest mb-1.5 block">Page Slug (URL)</label>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-white/25 flex-shrink-0">{domain}/</span>
                  <input value={store.slug} onChange={e=>{store.setSlug(e.target.value); setSlugStatus("idle");}}
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none min-w-0" placeholder="my-profile"/>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={verifySlugStatus} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white/60 transition-colors">Check Availability</button>
                  <button onClick={randomizeSlug} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white/60 transition-colors">Randomize</button>
                  {slugStatus === "loading" && <span className="text-[10px] text-indigo-400">Checking...</span>}
                  {slugStatus === "available" && <span className="text-[10px] text-green-400">Available</span>}
                  {slugStatus === "taken" && <span className="text-[10px] text-red-400">Taken</span>}
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">SEO</p>
                <input value={store.seoTitle} onChange={e=>up({seoTitle:e.target.value})} placeholder="SEO Title"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-500/50"/>
                <textarea value={store.seoDescription} onChange={e=>up({seoDescription:e.target.value})} placeholder="SEO Description" rows={2}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white resize-none focus:outline-none focus:border-indigo-500/50"/>
              </div>

              {store.projectId && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">Public URL</p>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-indigo-400 flex-1 truncate">{typeof window!=="undefined"?`${window.location.origin}/${store.slug}`:""}</span>
                    <button onClick={()=>navigator.clipboard?.writeText(`${window.location.origin}/${store.slug}`)} className="p-1 rounded hover:bg-white/10"><Copy className="w-3.5 h-3.5 text-white/40"/></button>
                    <a href={`/${store.slug}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-white/10"><ExternalLink className="w-3.5 h-3.5 text-white/40"/></a>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-white/5">
                <button onClick={handleExport} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/60 hover:text-white transition-colors">
                  <Download className="w-4 h-4"/>Export HTML
                </button>
                <label className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer">
                  <Upload className="w-4 h-4"/>Import HTML File
                  <input ref={htmlImportRef} type="file" accept=".html,.htm" className="hidden"
                    onChange={e=>{
                      const file=e.target.files?.[0]; if(!file) return;
                      const reader=new FileReader();
                      reader.onloadend=()=>{
                        const content=reader.result as string;
                        const body=content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                        const style=content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
                        if(body) store.setHtml(body[1].trim());
                        if(style) store.setCss(style[1].trim());
                        store.triggerPreview();
                      };
                      reader.readAsText(file);
                    }}/>
                </label>
                <button onClick={()=>store.resetEditor()} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/5 text-xs text-white/60 hover:text-red-400 transition-colors">
                  <RotateCcw className="w-4 h-4"/>Reset to Default
                </button>
              </div>
              {store.lastSaved&&<p className="text-[10px] text-white/25">Saved: {new Date(store.lastSaved).toLocaleTimeString()}</p>}
            </div>
          )}
        </div>

        {/* ── CANVAS ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Canvas toolbar */}
          <div className="h-9 border-b border-white/5 flex items-center px-3 gap-2 flex-shrink-0">
            {/* Selected element */}
            {selectedEl && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-[11px] text-indigo-300">
                <span className="font-mono">&lt;{selectedEl.tag}&gt;</span>
                <button onClick={()=>setSelectedEl(null)}><X className="w-3 h-3 opacity-50"/></button>
              </div>
            )}
            <div className="flex-1"/>
            <div className="flex items-center gap-0.5">
              <button onClick={()=>store.setZoom(store.zoom-0.1)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"><ZoomOut className="w-3.5 h-3.5"/></button>
              <span className="text-[11px] text-white/30 w-9 text-center">{Math.round(store.zoom*100)}%</span>
              <button onClick={()=>store.setZoom(store.zoom+0.1)} className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"><ZoomIn className="w-3.5 h-3.5"/></button>
            </div>
          </div>

          {/* Canvas body */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 relative"
            style={{background:"radial-gradient(ellipse at center, rgba(37,99,235,0.07) 0%, #020817 70%)"}}>
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{backgroundImage:"radial-gradient(circle, rgba(59,130,246,0.4) 1px, transparent 1px)", backgroundSize:"28px 28px"}}/>

            {store.showPreview ? (
              <div style={{width:size.w, height:size.h, transform:`scale(${store.zoom})`, transformOrigin:"center center", flexShrink:0}}
                className={`relative overflow-hidden shadow-2xl ${store.device==="mobile"?"iphone-frame":"rounded-xl border-4 border-[#1a1a1a]"}`}>
                <iframe ref={iframeRef} className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms" title="preview"/>
              </div>
            ) : (
              <div className="text-center">
                <EyeOff className="w-12 h-12 text-white/10 mx-auto mb-3"/>
                <p className="text-white/30 text-sm">Preview hidden</p>
                <button onClick={()=>store.togglePreview()} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300">Show preview</button>
              </div>
            )}

            {store.showPreview && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-white/20 pointer-events-none">
                {size.w} × {size.h} · {store.device}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── DONATION POPUP — editor only, every 40s ── */}
      <DonationPopup />

      {/* ── IMAGE UPLOAD MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {showUploader && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            style={{background:"rgba(0,0,0,0.8)",backdropFilter:"blur(4px)"}}
            onClick={()=>setShowUploader(false)}>
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
              onClick={e=>e.stopPropagation()} className="glass-card rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Upload Avatar</h3>
                <button onClick={()=>setShowUploader(false)} className="p-1.5 rounded-lg hover:bg-white/10"><X className="w-4 h-4 text-white/50"/></button>
              </div>
              <p className="text-xs text-white/40 mb-4">Hosted on GitHub CDN — free & fast.</p>
              <div onClick={()=>fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-white/25 mx-auto mb-2"/>
                <p className="text-sm text-white/50">Click to select image</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
              {uploading && <p className="mt-4 text-sm text-indigo-400 text-center animate-pulse">Uploading…</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MUSIC SEARCH MODAL ────────────────────────────────────── */}
      <MusicSearchModal 
        isOpen={showSearchModal} 
        onClose={() => setShowSearchModal(false)}
        onSelect={(song) => {
          store.updateProfile({ 
            musicPlatform: "youtubemusic", 
            musicUrl: `https://music.youtube.com/watch?v=${song.id}` 
          });
          setShowSearchModal(false);
        }}
      />
    </div>
  );
}
