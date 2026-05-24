// lib/engine.ts

let _counter = 0;

export function injectEditorIds(html: string): string {
  _counter = 0;
  return html.replace(/<(\w[\w.-]*)(\s[^>]*)?(\/?>)/g, (match, tag, attrs = "", close) => {
    if (close === "/>") return match;
    if (/data-editor-id/.test(attrs || "")) return match;
    const voidTags = ["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];
    if (voidTags.includes(tag.toLowerCase())) return match;
    const id = `lq-${_counter++}`;
    return `<${tag}${attrs} data-editor-id="${id}">`;
  });
}

export function stripEditorIds(html: string): string {
  return html.replace(/\s*data-editor-id="[^"]*"/g, "");
}

export function getIframeClickDetectorScript(): string {
  return `
(function() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-editor-id]');
    if (!el) return;
    
    // Jika elemen adalah link (A) atau di dalam link, biarkan default agar bisa dibuka
    // kecuali jika user sedang mengedit (opsional, tapi untuk preview kita ingin fungsional)
    if (e.target.closest('a') || e.target.closest('button:not([data-editor-id])')) {
      // Biarkan link berjalan
    } else {
      e.preventDefault();
    }

    window.parent.postMessage({
      type: 'lq:element:click',
      editorId: el.getAttribute('data-editor-id'),
      tag: el.tagName.toLowerCase()
    }, '*');
  }, true);
})();
`;
}

export const EDITOR_MSG = {
  CLICK: 'lq:element:click',
} as const;
