"use client";

import DOMPurify from "isomorphic-dompurify";
import type { Project } from "@/types";
import LingkoraqWatermark from "@/components/LingkoraqWatermark";

interface BioViewProps {
  project: Project;
}

export default function BioView({ project }: BioViewProps) {
  const cleanHtml = DOMPurify.sanitize(project.html_code, {
    ALLOWED_TAGS: [
      "div", "span", "p", "a", "img", "h1", "h2", "h3", "h4", "h5", "h6",
      "br", "hr", "strong", "b", "em", "i", "u", "s", "strike", "del",
      "ul", "ol", "li", "blockquote", "code", "pre", "button", "input",
      "label", "textarea", "select", "option", "form", "table", "thead",
      "tbody", "tr", "td", "th", "iframe", "video", "audio", "source",
      "svg", "path", "circle", "rect", "line", "polyline", "polygon",
      "text", "g", "defs", "use", "linearGradient", "stop", "nav", "header",
      "footer", "main", "section", "article", "aside", "figure", "figcaption",
      "details", "summary", "mark", "small", "sub", "sup", "time", "abbr",
      "address", "cite", "q", "dfn", "kbd", "samp", "var", "wbr", "progress",
      "meter", "fieldset", "legend", "datalist", "output", "optgroup",
    ],
    ALLOWED_ATTR: [
      "href", "src", "alt", "title", "class", "id", "style", "width", "height",
      "target", "rel", "name", "value", "type", "placeholder", "readonly",
      "disabled", "checked", "selected", "multiple", "size", "min", "max",
      "step", "pattern", "required", "autocomplete", "autofocus", "novalidate",
      "form", "formaction", "formmethod", "formtarget", "for", "role",
      "aria-label", "aria-hidden", "aria-expanded", "aria-controls",
      "aria-describedby", "aria-labelledby", "tabindex", "data-*",
      "viewBox", "fill", "stroke", "stroke-width", "d", "cx", "cy", "r",
      "x", "y", "x1", "y1", "x2", "y2", "points", "transform", "xmlns",
      "clip-path", "mask", "filter", "opacity", "dx", "dy", "text-anchor",
      "startOffset", "gradientUnits", "gradientTransform", "offset", "stop-color",
      "stop-opacity", "spreadMethod", "href", "clipPathUnits", "preserveAspectRatio",
      "loading", "crossorigin", "poster", "controls", "autoplay", "loop", "muted",
      "preload", "playsinline", "download",
      "allow", "allowfullscreen", "frameborder", "sandbox",
    ],
    ALLOW_DATA_ATTR: true,
  });

  const cleanCss = DOMPurify.sanitize(project.css_code, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  const cleanJs = project.js_code;

  const srcDoc = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${project.title}</title>
      <style>
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
        ${cleanCss}
      </style>
    </head>
    <body>
      ${cleanHtml}
      <script>
        try {
          ${cleanJs}
        } catch(e) {
          console.error('User script error:', e);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-white relative">
      <iframe
        srcDoc={srcDoc}
        className="w-full min-h-screen border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        title={project.title}
      />
      <LingkoraqWatermark />
    </div>
  );
}
