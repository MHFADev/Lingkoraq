"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, LayoutDashboard, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabaseBrowser";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const supabase = createClientBrowser();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClientBrowser();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 28, stiffness: 180, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="relative"
          >
            {/* Subtle glow behind logo on hover */}
            <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <Image
              src="/lingkoraq-logo.svg"
              alt="Lingkoraq - Premium Bio Link Platform"
              width={160}
              height={44}
              className="relative z-10 h-10 w-auto object-contain"
              priority
            />
          </motion.div>
        </Link>

        {/* Nav Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/editor"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200 border border-transparent hover:border-white/[0.08]"
              >
                <LayoutDashboard className="w-4 h-4" />
                Editor
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.08] transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="hidden md:block text-xs text-white/70 max-w-[110px] truncate">
                    {user.email}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/[0.08] bg-[#0a1628]/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
                    >
                      <div className="p-1.5">
                        <Link
                          href="/editor"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/[0.08] transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Go to Editor
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all mt-0.5"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="relative group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden"
            >
              {/* Liquid button background */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 group-hover:from-blue-500 group-hover:to-cyan-400" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />
              <User className="relative z-10 w-4 h-4" />
              <span className="relative z-10">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
