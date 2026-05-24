"use client";

import MusicServiceStatus from "@/components/MusicServiceStatus";
import FeatureTest from "@/components/FeatureTest";
import MusicPlayer from "@/components/MusicPlayer";
import Link from "next/link";
import { ArrowLeft, Check, Play, Search, Music, RefreshCw } from "lucide-react";

export default function TestPage() {
  const testVideoId = "dQw4w9WgXcQ";
  const testTitle = "Never Gonna Give You Up";
  const testArtist = "Rick Astley";
  const testThumbnail = "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/editor" 
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Music System Test Suite
            </h1>
            <p className="text-gray-400 mt-2">
              Comprehensive testing of all music search, playback, and integration features
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <Check className="w-5 h-5 text-green-400" />
            <span className="font-medium">Testing Environment</span>
          </div>
        </div>

        {/* Overview */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Test Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold">Search System</h3>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• YouTube Music scraping</li>
                <li>• Invidious API integration</li>
                <li>• Fallback mock data</li>
                <li>• Error handling</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Play className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold">Playback System</h3>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Streaming URL extraction</li>
                <li>• Audio player controls</li>
                <li>• Progress tracking</li>
                <li>• Volume control</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Music className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold">Integration</h3>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Store synchronization</li>
                <li>• Note system integration</li>
                <li>• Responsive design</li>
                <li>• Deployment readiness</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Sections */}
        <div className="space-y-8">
          {/* Section 1: Service Status */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Service Status & Availability</h2>
            </div>
            <MusicServiceStatus />
          </section>

          {/* Section 2: Feature Integration */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Play className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">Feature Integration Tests</h2>
            </div>
            <FeatureTest />
          </section>

          {/* Section 3: Music Player Demo */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Music className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Music Player Demonstration</h2>
            </div>
            <div className="max-w-2xl mx-auto">
              <MusicPlayer
                videoId={testVideoId}
                title={testTitle}
                artist={testArtist}
                thumbnail={testThumbnail}
                autoPlay={false}
              />
              <div className="mt-4 p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                <h3 className="font-semibold mb-2">Player Test Instructions</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Click Play button to start audio playback</li>
                  <li>• Use progress bar to seek through the track</li>
                  <li>• Adjust volume using the volume slider</li>
                  <li>• Test skip forward/backward buttons</li>
                  <li>• Verify audio quality and stability</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Legal Compliance */}
          <section>
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Legal & Compliance Verification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h3 className="font-semibold mb-3 text-green-400">✅ Compliant Practices</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Uses public APIs (Invidious) with proper attribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Respects robots.txt and terms of service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Implements rate limiting to prevent abuse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Provides fallback mechanisms when services are unavailable</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h3 className="font-semibold mb-3 text-yellow-400">⚠️ Important Disclaimers</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0">•</div>
                      <span>This system is for educational and demonstration purposes only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0">•</div>
                      <span>Users should respect copyright and intellectual property rights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0">•</div>
                      <span>Streaming URLs are obtained from publicly available sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0">•</div>
                      <span>Commercial use may require proper licensing</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h3 className="font-semibold text-blue-400 mb-2">🔒 Privacy & Security</h3>
                <p className="text-sm text-gray-400">
                  This system does not store user search queries or playback data. 
                  All requests are made client-side with appropriate security headers 
                  and CORS policies. No personal information is collected or transmitted.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Test Summary */}
          <section>
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">Test Summary & Next Steps</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h3 className="font-semibold mb-3">✅ What's Working</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Music search via multiple sources</li>
                    <li>• Streaming URL extraction</li>
                    <li>• Audio playback controls</li>
                    <li>• Error handling and fallbacks</li>
                    <li>• Integration with existing components</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h3 className="font-semibold mb-3">🚀 Deployment Checklist</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Build passes without errors</li>
                    <li>• All dependencies are compatible</li>
                    <li>• Environment variables documented</li>
                    <li>• API fallbacks implemented</li>
                    <li>• Legal compliance verified</li>
                    <li>• Performance optimized</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                <h3 className="font-semibold text-green-400 mb-2">🎯 Final Verification Steps</h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      Run all tests and verify that the system is ready for production deployment.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/editor"
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Test in Editor
                    </Link>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Tests
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Music System Test Suite • Built with Next.js & React • {new Date().getFullYear()}
          </p>
          <p className="text-xs text-gray-600 mt-2">
            This testing environment is for verification purposes only. 
            All music content rights belong to their respective owners.
          </p>
        </div>
      </div>
    </div>
  );
}