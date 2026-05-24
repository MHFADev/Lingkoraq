"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRESETS, PRESET_CATEGORIES } from "@/lib/presets";

interface Props {
  onInject: (html: string, css: string) => void;
}

export default function PresetPanel({ onInject }: Props) {
  const [cat, setCat] = useState<string>("profile");
  const [injected, setInjected] = useState<string | null>(null);

  const list = PRESETS.filter((p) => p.category === cat);

  const handleInject = (preset: (typeof PRESETS)[0]) => {
    onInject(preset.html, preset.css);
    setInjected(preset.id);
    setTimeout(() => setInjected(null), 1400);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Category pills */}
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2 px-1">Components</p>
        <div className="flex flex-wrap gap-1">
          {PRESET_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                cat === c.id
                  ? "bg-indigo-500/25 text-indigo-300 border border-indigo-500/30"
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-transparent"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.13 }}
            className="space-y-1.5"
          >
            {list.map((p) => {
              const ok = injected === p.id;
              return (
                <motion.button
                  key={p.id}
                  onClick={() => handleInject(p)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all border ${
                    ok
                      ? "bg-green-500/10 border-green-500/25 text-green-400"
                      : "bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/10 text-white/70 hover:text-white"
                  }`}
                >
                  <span className="text-lg leading-none flex-shrink-0">{p.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{ok ? "✓ Added!" : p.name}</p>
                    <p className="text-[10px] text-white/25 truncate">{`<${p.html.match(/<(\w+)/)?.[1] ?? "div"}>`}</p>
                  </div>
                  {!ok && <span className="text-[10px] text-white/20 flex-shrink-0">+ Add</span>}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
