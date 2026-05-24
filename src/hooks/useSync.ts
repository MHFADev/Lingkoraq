"use client";
import { useCallback, useEffect, useRef } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { injectEditorIds, stripEditorIds, getIframeClickDetectorScript, EDITOR_MSG } from "@/lib/engine";

interface UseSyncOptions {
  onElementClick?: (editorId: string, tag: string) => void;
}

export function useSync(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  options: UseSyncOptions = {}
) {
  const store = useEditorStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const writeToIframe = useCallback((html: string, css: string, js: string) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const htmlWithIds = injectEditorIds(html);
    
    // Add Instagram-style floating note above profile photo if enabled
    let noteHtml = '';
    if (store.showNote && store.noteText) {
      const musicHtml = store.noteMusicThumbnail ? `
        <div class="note-music">
          <img src="${store.noteMusicThumbnail}" alt="${store.noteMusicTitle || ''}" class="note-music-thumb" />
          <div class="note-music-info">
            <div class="note-music-title">${store.noteMusicTitle || ''}</div>
            <div class="note-music-artist">${store.noteMusicArtist || ''}</div>
          </div>
        </div>` : '';
      
      noteHtml = `
        <div class="profile-note-float">
          <div class="note-bubble">
            <p class="note-text">${store.noteText}</p>
            ${musicHtml}
          </div>
        </div>
      `;
      
      // Tambahkan CSS untuk note
      css += `
        .profile-note-float {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          animation: floatIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        @keyframes floatIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.9); }
          to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .note-bubble {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 16px 20px;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          max-width: 280px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .note-text {
          margin: 0 0 12px 0;
          font-size: 14px;
          line-height: 1.5;
          color: #1a1a1a;
          font-weight: 500;
        }
        .note-music {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid rgba(0,0,0,0.08);
        }
        .note-music-thumb {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }
        .note-music-info {
          flex: 1;
          min-width: 0;
        }
        .note-music-title {
          font-size: 12px;
          font-weight: 600;
          color: #1a1a1a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .note-music-artist {
          font-size: 11px;
          color: #666;
          margin-top: 2px;
        }
      `;
    }
    
    const clickScript = getIframeClickDetectorScript();
    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:-apple-system,sans-serif;position:relative}
[data-editor-id]:hover{outline:2px solid rgba(99,102,241,0.6);outline-offset:1px;cursor:pointer;border-radius:2px}
${css}
</style>
</head>
<body>
${noteHtml}
${htmlWithIds}
<script>
try{${js}}catch(e){console.warn('JS error:',e);}
${clickScript}
</script>
</body>
</html>`;
  }, [iframeRef, store.showNote, store.noteText, store.noteMusicThumbnail, store.noteMusicTitle, store.noteMusicArtist]);

  // Debounced sync 250ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeToIframe(store.html, store.css, store.js);
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [store.html, store.css, store.js, store.previewKey, writeToIframe, store.showNote, store.noteText, store.noteMusicThumbnail, store.noteMusicTitle, store.noteMusicArtist]);

  // PostMessage listener
  useEffect(() => {
    const cb = options.onElementClick;
    const handler = (e: MessageEvent) => {
      if (!e.data?.type) return;
      if (e.data.type === EDITOR_MSG.CLICK && cb) cb(e.data.editorId, e.data.tag);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [options.onElementClick]);

  const getCleanHtml = useCallback(() => stripEditorIds(store.html), [store.html]);

  return { getCleanHtml };
}
