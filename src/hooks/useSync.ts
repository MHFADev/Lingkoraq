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
    const clickScript = getIframeClickDetectorScript();
    iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
*,*::before,*::after{box-sizing:border-box}
body{margin:0;font-family:-apple-system,sans-serif}
[data-editor-id]:hover{outline:2px solid rgba(99,102,241,0.6);outline-offset:1px;cursor:pointer;border-radius:2px}
${css}
</style>
</head>
<body>
${htmlWithIds}
<script>
try{${js}}catch(e){console.warn('JS error:',e);}
${clickScript}
</script>
</body>
</html>`;
  }, [iframeRef]);

  // Debounced sync 250ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeToIframe(store.html, store.css, store.js);
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [store.html, store.css, store.js, store.previewKey, writeToIframe]);

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
