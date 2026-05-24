"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Code2, Globe, Shield, Smartphone, Layers, ArrowRight, Link2, Sparkles
} from "lucide-react";
import LogoIcon from "@/components/LogoIcon";

const features = [
  {
    icon: Code2,
    title: "Hybrid Editor",
    desc: "Switch seamlessly between visual editing and raw code with Monaco Editor.",
    accent: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Globe,
    title: "GitHub CDN",
    desc: "Free image hosting powered by GitHub & raw.githubusercontent.com.",
    accent: "from-cyan-500/20 to-blue-400/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "DOMPurify sanitization on all public pages. Your users are safe.",
    accent: "from-blue-400/20 to-indigo-500/20",
    iconColor: "text-blue-300",
  },
  {
    icon: Smartphone,
    title: "Live Preview",
    desc: "Real-time iPhone mockup with responsive breakpoints built-in.",
    accent: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-400",
  },
  {
    icon: Layers,
    title: "Unlimited Projects",
    desc: "No VIP limits. Create as many bio-link pages as you want.",
    accent: "from-blue-500/20 to-sky-400/20",
    iconColor: "text-sky-400",
  },
  {
    icon: LogoIcon,
    title: "Blazing Fast",
    desc: "Next.js App Router with edge-ready static generation.",
    accent: "from-cyan-400/20 to-blue-600/20",
    iconColor: "text-cyan-300",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      damping: 22, 
      stiffness: 200 
    } 
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#030712] min-h-screen text-white">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6">

        {/* Liquid background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[15%] left-[15%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-[40%] right-[25%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-[80px]"
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-sm text-blue-300 font-medium">Free Forever. No Limits.</span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
          >
            Satu Link,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Banyak Link
            </span>
          </motion.h1>

          {/* BLUF: Bottom Line Up Front (40-60 words) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 max-w-3xl mx-auto text-left"
          >
            <p className="text-sm md:text-base text-blue-100/80 leading-relaxed">
              <strong>Lingkoraq</strong> adalah platform bio-link premium yang memungkinkan kreator membangun halaman landing profesional dengan editor hybrid (visual + kode). Anda dapat membuat link bio tanpa batas secara gratis, menggunakan hosting gambar via GitHub, dan kustomisasi penuh tanpa batasan VIP. Solusi tercepat untuk mengelola personal brand Anda dalam satu link yang cantik dan responsif.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Platform bio-link premium untuk kreator yang nggak mau biasa-biasa aja.
            Build dengan visual editor atau kode — canvas-mu, aturan-mu.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/editor"
              className="group relative flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.18)_0%,_transparent_70%)]" />
              <Sparkles className="relative z-10 w-5 h-5" />
              <span className="relative z-10">Start Creating</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-medium text-white/70 hover:text-white bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] transition-all duration-300 hover:border-blue-500/30"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 text-sm text-white/25"
          >
            Digunakan oleh ribuan kreator Indonesia 🇮🇩
          </motion.p>
        </div>

        {/* Scrolling indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/20 flex items-center justify-center"
          >
            <div className="w-1 h-2 rounded-full bg-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.2em] mb-4">Fitur Lengkap</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
              Apa Saja Fitur Utama Lingkoraq untuk Kreator?
            </h2>
            <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
              Toolkit lengkap untuk membangun, hosting, dan sharing personal brand kamu dengan standar profesional.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative rounded-2xl p-6 border border-white/[0.07] bg-white/[0.03] hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all duration-300 overflow-hidden cursor-default"
              >
                {/* Card glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top_left,_rgba(59,130,246,0.08)_0%,_transparent_60%)] pointer-events-none" />

                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-cyan-500/5 p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            {[
              { value: "10K+", label: "Kreator aktif" },
              { value: "50K+", label: "Bio link dibuat" },
              { value: "100%", label: "Gratis selamanya" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0a1628]/60 backdrop-blur-sm p-14 text-center"
        >
          {/* Animated bg */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-400/10 blur-[80px] pointer-events-none"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/15 to-blue-600/10 blur-[80px] pointer-events-none"
          />

          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center mx-auto mb-7 shadow-xl shadow-blue-500/25">
              <Link2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Siap untuk membuat?
            </h2>
            <p className="text-white/45 mb-9 max-w-md mx-auto leading-relaxed">
              Bergabung dengan ribuan kreator yang membangun pojok internet mereka dengan Lingkoraq.
            </p>
            <Link
              href="/editor"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]"
            >
              Launch Editor
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="group">
            <Image
              src="/lingkoraq-logo.svg"
              alt="Lingkoraq"
              width={160}
              height={44}
              className="h-9 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          <p className="text-sm text-white/25">
            Satu Link, Banyak Link · Built with passion. Free forever.
          </p>
        </div>
      </footer>
    </div>
  );
}
