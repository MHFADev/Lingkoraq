"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Coffee, Zap, BellOff } from "lucide-react";

const FIRST_DELAY  = 5000;   // 5s after editor loads
const INTERVAL_MS  = 40000;  // every 40s
const UNSKIPPABLE_S = 4;     // 4s before can close
const LS_KEY = "lq_donation_dismissed";

export default function DonationPopup() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [canClose,  setCanClose]  = useState(false);
  const [countdown, setCountdown] = useState(UNSKIPPABLE_S);
  const [showCount, setShowCount] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(LS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  const openPopup = useCallback(() => {
    if (typeof window !== "undefined" && localStorage.getItem(LS_KEY) === "1") return;
    setIsOpen(true);
    setCanClose(false);
    setCountdown(UNSKIPPABLE_S);
  }, []);

  // First show after 5s
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => { openPopup(); setShowCount(1); }, FIRST_DELAY);
    return () => clearTimeout(t);
  }, [openPopup, dismissed]);

  // Every 40s after first close
  useEffect(() => {
    if (showCount === 0 || dismissed) return;
    const interval = setInterval(() => { setShowCount(c => c + 1); openPopup(); }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [showCount, openPopup, dismissed]);

  // Countdown to allow close
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { setCanClose(true); clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => { if (!canClose) return; setIsOpen(false); };

  const handleDismissForever = () => {
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, "1");
    setDismissed(true);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl"
            style={{
              background: "linear-gradient(145deg, rgba(18,18,28,0.99) 0%, rgba(12,12,20,0.99) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 48px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            {/* Animated top shimmer */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #ec4899, #a855f7, #ec4899, transparent)" }}
              animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            {/* Particle orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute -top-20 -right-20 w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)" }}
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-purple-400/40"
                  style={{ left: `${15 + i * 15}%`, top: "60%" }}
                  animate={{ y: [0, -40, 0], opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                />
              ))}
            </div>

            {/* Close button (X top-right) */}
            <AnimatePresence>
              {canClose && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <X className="w-3.5 h-3.5 text-white/60" />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="relative z-10 p-7">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)",
                  boxShadow: "0 12px 40px rgba(168,85,247,0.4)",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-8 h-8 text-white fill-white" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-purple-400/40"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-center mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                  <h2 className="text-xl font-bold text-white">Support Lingkoraq</h2>
                  <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Platform ini <span className="text-white/70 font-medium">100% gratis</span>. Donasi kamu membantu server tetap berjalan &amp; fitur baru terus hadir. 🙏
                </p>
              </motion.div>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-col gap-2.5"
              >
                <a
                  href="https://trakteer.id/Smitsh_Jon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl font-semibold text-white text-sm overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #e8563b, #c94028)", boxShadow: "0 4px 20px rgba(232,86,59,0.3)" }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <svg className="relative z-10" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13v2H9v2h2v6h2v-6h2v-2h-2V7h-2z"/>
                  </svg>
                  <span className="relative z-10">☕ Trakteer</span>
                </a>

                <a
                  href="https://saweria.co/MHFADev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl font-semibold text-white text-sm overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", boxShadow: "0 4px 20px rgba(245,158,11,0.25)" }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <Coffee className="relative z-10 w-4 h-4" />
                  <span className="relative z-10">🌟 Saweria</span>
                </a>
              </motion.div>

              {/* Bottom actions */}
              <div className="mt-5 flex flex-col items-center gap-3">
                {/* Countdown / close */}
                {!canClose ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="relative w-6 h-6">
                      <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
                        <motion.circle
                          cx="12" cy="12" r="10"
                          fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="2"
                          strokeDasharray={62.8}
                          strokeDashoffset={62.8 * (1 - countdown / UNSKIPPABLE_S)}
                          strokeLinecap="round"
                          transition={{ duration: 1 }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white/50 font-medium">{countdown}</span>
                    </div>
                    <span className="text-white/30 text-xs">Tutup dalam {countdown}s</span>
                  </div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={handleClose}
                    className="text-white/30 text-xs hover:text-white/60 transition-colors"
                  >
                    Nanti saja ✕
                  </motion.button>
                )}

                {/* Dismiss forever — only shown after canClose */}
                <AnimatePresence>
                  {canClose && (
                    <motion.button
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={handleDismissForever}
                      className="flex items-center gap-1.5 text-white/20 text-[11px] hover:text-white/50 transition-colors group"
                    >
                      <BellOff className="w-3 h-3 group-hover:text-white/50" />
                      Jangan ingatkan lagi
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
