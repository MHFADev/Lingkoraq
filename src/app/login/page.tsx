"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, AlertCircle } from "lucide-react";
import { createClientBrowser } from "@/lib/supabaseBrowser";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loadingGitHub, setLoadingGitHub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromPath, setFromPath] = useState("/editor");

  const router = useRouter();
  const supabase = useMemo(() => createClientBrowser(), []);
  const isLoading = loadingGitHub || loadingGoogle;

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    const fromParam = params.get("from");
    if (errorParam === "auth") setError("Authentication failed. Please try again.");
    if (fromParam) setFromPath(fromParam);
    supabase.auth.getUser()
      .then(({ data }) => { if (data.user) router.replace("/editor"); })
      .catch(() => {});
  }, [supabase, router]);

  const handleOAuth = async (provider: "github" | "google") => {
    if (provider === "github") setLoadingGitHub(true);
    else setLoadingGoogle(true);
    setError(null);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(fromPath)}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setLoadingGitHub(false);
      setLoadingGoogle(false);
      setError(err.message || `Failed to start ${provider} login. Please try again.`);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 relative overflow-hidden bg-[#030712]">

      {/* Liquid animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[5%] right-[5%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px]"
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-10"
        >
          <Link href="/" className="flex flex-col items-center group">
            <motion.div
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="relative"
            >
              {/* Glow halo behind logo */}
              <div className="absolute inset-x-4 inset-y-2 bg-blue-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <Image
                src="/lingkoraq-logo.svg"
                alt="Lingkoraq"
                width={210}
                height={58}
                className="relative z-10 h-14 w-auto object-contain drop-shadow-[0_0_16px_rgba(37,99,235,0.5)]"
                priority
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", damping: 28 }}
          className="relative rounded-3xl overflow-hidden border border-white/[0.09]"
          style={{
            background: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(10,16,30,0.98) 100%)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 60px rgba(37,99,235,0.08)",
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

          <div className="p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center">
                  <Lock className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Secure Login</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">Welcome back</h2>
              <p className="text-white/45 text-sm mt-1.5 leading-relaxed">
                Lanjutkan membuat bio-link page terbaikmu.
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <p className="text-xs text-red-300 leading-relaxed">{error}</p>
              </motion.div>
            )}

            {/* Google Button */}
            <motion.button
              onClick={() => handleOAuth("google")}
              disabled={isLoading || !mounted}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-full group mb-3"
            >
              <div
                className="w-full py-3.5 px-5 rounded-2xl flex items-center justify-between gap-3 font-semibold text-white text-sm transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #111827 0%, #1e2433 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    {loadingGoogle ? (
                      <svg className="w-4 h-4 animate-spin text-gray-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                  </div>
                  <span>{loadingGoogle ? "Redirecting to Google..." : "Continue with Google"}</span>
                </div>
                {!loadingGoogle && (
                  <ArrowRight className="w-4 h-4 text-white/35 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "0 0 0 1px rgba(66,133,244,0.4), 0 8px 32px rgba(66,133,244,0.12)" }} />
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[11px] text-white/25 font-medium">or</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>

            {/* GitHub Button */}
            <motion.button
              onClick={() => handleOAuth("github")}
              disabled={isLoading || !mounted}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative w-full group"
            >
              <div
                className="w-full py-3.5 px-5 rounded-2xl flex items-center justify-between gap-3 font-semibold text-white text-sm transition-all disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #111827 0%, #1e2433 100%)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.07] flex items-center justify-center flex-shrink-0">
                    {loadingGitHub ? (
                      <svg className="w-4 h-4 animate-spin text-white/60" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    )}
                  </div>
                  <span>{loadingGitHub ? "Redirecting to GitHub..." : "Continue with GitHub"}</span>
                </div>
                {!loadingGitHub && (
                  <ArrowRight className="w-4 h-4 text-white/35 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: "0 0 0 1px rgba(37,99,235,0.4), 0 8px 32px rgba(37,99,235,0.12)" }} />
            </motion.button>

            {/* Privacy note */}
            <div className="mt-6 pt-6 border-t border-white/[0.05]">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-xs text-white/30 leading-relaxed">
                  Kami hanya meminta akses public profile untuk membuat akun. Tidak ada data privat yang diakses.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-xs text-white/20"
        >
          Gratis selamanya · Tidak perlu kartu kredit
        </motion.p>
      </div>
    </div>
  );
}
