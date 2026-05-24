"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy, Check, MessageCircle, Send, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";

interface WhatsAppShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppShare({
  url,
  title,
  description = "Check out this amazing bio link page!",
  imageUrl,
  isOpen,
  onClose,
}: WhatsAppShareProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "share">("preview");
  const [shareMethod, setShareMethod] = useState<"direct" | "copy" | "qr">("direct");

  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${fullUrl}`)}`;
  const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(`${title}\n\n${description}\n\n${fullUrl}`)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDirectShare = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-green-500/20 to-emerald-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Share to WhatsApp</h2>
                  <p className="text-sm text-white/60">Share your bio link with the world</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "preview"
                  ? "text-green-400 border-b-2 border-green-400 bg-green-500/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("share")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "share"
                  ? "text-green-400 border-b-2 border-green-400 bg-green-500/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Share2 className="w-4 h-4" />
              Share Options
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === "preview" ? (
              <div className="space-y-6">
                {/* WhatsApp Preview Card */}
                <div className="bg-[#0b141a] rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">WhatsApp Preview</p>
                      <p className="text-xs text-white/50">How your link will appear</p>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className="flex justify-end mb-4">
                    <div className="max-w-[85%] bg-[#005c4b] rounded-2xl rounded-tr-sm p-3 shadow-lg">
                      <p className="text-white text-[15px] leading-relaxed mb-2">
                        Hey! Check out this amazing bio link I created with Lingkoraq 🚀
                      </p>
                      
                      {/* Link Preview Card */}
                      <div className="bg-[#0b141a]/60 rounded-xl overflow-hidden border border-white/10">
                        {imageUrl && (
                          <div className="relative w-full h-32 bg-gradient-to-br from-gray-800 to-gray-900">
                            <Image
                              src={imageUrl}
                              alt={title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                        )}
                        <div className="p-3">
                          <h4 className="text-white font-semibold text-sm mb-1 line-clamp-1">{title}</h4>
                          <p className="text-white/60 text-xs line-clamp-2">{description}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <span className="text-[8px] text-white font-bold">L</span>
                            </div>
                            <span className="text-[10px] text-white/40">lingkoraq.my.id</span>
                          </div>
                        </div>
                      </div>

                      {/* Message Meta */}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-white/40">12:30 PM</span>
                        <svg className="w-3.5 h-3.5 text-[#53bdeb]" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.645a.32.32 0 0 0 .484.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Info */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Rich Preview Enabled</h4>
                      <p className="text-sm text-white/60">
                        Your link will display with a beautiful preview card including image, title, and description when shared on WhatsApp, social media, or messaging apps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Share Method Selection */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setShareMethod("direct")}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      shareMethod === "direct"
                        ? "border-green-500 bg-green-500/10"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${shareMethod === "direct" ? "bg-green-500" : "bg-white/10"}`}>
                      <Send className={`w-5 h-5 ${shareMethod === "direct" ? "text-white" : "text-white/60"}`} />
                    </div>
                    <span className={`text-xs font-medium ${shareMethod === "direct" ? "text-green-400" : "text-white/60"}`}>
                      Direct Share
                    </span>
                  </button>

                  <button
                    onClick={() => setShareMethod("copy")}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      shareMethod === "copy"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${shareMethod === "copy" ? "bg-blue-500" : "bg-white/10"}`}>
                      <Copy className={`w-5 h-5 ${shareMethod === "copy" ? "text-white" : "text-white/60"}`} />
                    </div>
                    <span className={`text-xs font-medium ${shareMethod === "copy" ? "text-blue-400" : "text-white/60"}`}>
                      Copy Link
                    </span>
                  </button>

                  <button
                    onClick={() => setShareMethod("qr")}
                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      shareMethod === "qr"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 hover:border-white/20 bg-white/5"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${shareMethod === "qr" ? "bg-purple-500" : "bg-white/10"}`}>
                      <svg className={`w-5 h-5 ${shareMethod === "qr" ? "text-white" : "text-white/60"}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-2 2v2h2v-2h-2zm-4-8h2v2h-2V9zm2 2h2v2h-2v-2z"/>
                      </svg>
                    </div>
                    <span className={`text-xs font-medium ${shareMethod === "qr" ? "text-purple-400" : "text-white/60"}`}>
                      QR Code
                    </span>
                  </button>
                </div>

                {/* Share Action Area */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  {shareMethod === "direct" && (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-green-500/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <Send className="w-10 h-10 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Open WhatsApp</h4>
                        <p className="text-white/60 text-sm mb-4">
                          This will open WhatsApp with your link ready to share
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={handleDirectShare}
                          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Open WhatsApp
                        </button>
                        <button
                          onClick={() => window.open(whatsappAppUrl, "_blank")}
                          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Use App
                        </button>
                      </div>
                    </div>
                  )}

                  {shareMethod === "copy" && (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-blue-500/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <Copy className="w-10 h-10 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Copy Link</h4>
                        <p className="text-white/60 text-sm mb-4">
                          Copy your link to paste anywhere
                        </p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 mb-4">
                        <p className="text-white/80 text-sm truncate">{fullUrl}</p>
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 w-full sm:w-auto mx-auto ${
                          copied
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {shareMethod === "qr" && (
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-purple-500/10 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-2 2v2h2v-2h-2zm-4-8h2v2h-2V9zm2 2h2v2h-2v-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">QR Code</h4>
                        <p className="text-white/60 text-sm mb-4">
                          Scan to open on mobile
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl inline-block">
                        <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 15h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-2 2v2h2v-2h-2zm-4-8h2v2h-2V9zm2 2h2v2h-2v-2z"/>
                            </svg>
                            <p className="text-xs text-gray-500">QR Code Placeholder</p>
                            <p className="text-[10px] text-gray-400 mt-1">Use external QR generator</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-white/40">
                        Use a QR code generator service with URL: {fullUrl}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-white">1.2k</p>
                    <p className="text-xs text-white/50">Shares</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-green-400">89%</p>
                    <p className="text-xs text-white/50">Click Rate</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-blue-400">45</p>
                    <p className="text-xs text-white/50">Countries</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
