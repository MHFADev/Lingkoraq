"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LingkoraqWatermark() {
  return (
    <motion.a
      href="https://www.lingkoraq.my.id"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.5, duration: 0.4, type: "spring", damping: 20 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl no-underline select-none group"
      style={{
        background: "rgba(3,7,18,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(37,99,235,0.08) inset",
      }}
    >
      {/* Pulse dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"
        animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Logo */}
      <Image
        src="/lingkoraq-logo.svg"
        alt="Lingkoraq"
        width={90}
        height={24}
        className="h-5 w-auto object-contain opacity-60 group-hover:opacity-90 transition-opacity duration-300"
        priority
      />
    </motion.a>
  );
}
