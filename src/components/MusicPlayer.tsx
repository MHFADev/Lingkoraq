"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, SkipBack, SkipForward, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getMusicStreamUrl } from "@/lib/musicScraper";

interface MusicPlayerProps {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

export default function MusicPlayer({
  videoId,
  title,
  artist,
  thumbnail,
  autoPlay = false,
  onPlay,
  onPause,
  onEnd
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Inisialisasi audio player
  useEffect(() => {
    const initializePlayer = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Dapatkan streaming URL
        const url = await getMusicStreamUrl(videoId);
        
        if (!url) {
          throw new Error("Tidak dapat mendapatkan URL streaming");
        }
        
        setStreamUrl(url);
        
        // Buat elemen audio
        const audio = new Audio(url);
        audio.volume = volume;
        
        // Event listeners
        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
          setIsLoading(false);
          
          if (autoPlay) {
            audio.play().catch(e => {
              console.error("Autoplay failed:", e);
              setError("Autoplay tidak diizinkan. Silakan klik tombol play.");
            });
          }
        });
        
        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);
        });
        
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          onEnd?.();
        });
        
        audio.addEventListener('error', (e) => {
          console.error("Audio error:", e);
          setError("Gagal memuat audio. Silakan coba lagi.");
          setIsLoading(false);
        });
        
        audioRef.current = audio;
        
        // Cleanup
        return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
        };
        
      } catch (err: any) {
        console.error("Player initialization error:", err);
        setError(err.message || "Gagal menginisialisasi pemutar musik");
        setIsLoading(false);
      }
    };
    
    initializePlayer();
    
    // Cleanup pada unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [videoId, autoPlay]);
  
  // Kontrol pemutaran
  const togglePlay = async () => {
    if (!audioRef.current || isLoading) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        onPlay?.();
      }
    } catch (err: any) {
      console.error("Play/pause error:", err);
      setError("Gagal mengontrol pemutaran");
    }
  };
  
  // Atur waktu pemutaran
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  // Atur volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Format waktu (detik ke MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Persentase progress
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Fallback jika streaming URL tidak tersedia
  if (error && !streamUrl) {
    return (
      <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{title}</h3>
            <p className="text-sm text-white/60 truncate">{artist}</p>
            <p className="text-xs text-red-400 mt-1">{error}</p>
            <p className="text-xs text-white/40 mt-1">
              Gunakan tombol "Search" untuk mencari musik alternatif
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg">
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-lg truncate">{title}</h3>
          <p className="text-sm text-white/70 truncate">{artist}</p>
          
          {/* Time Display */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-white/50">{formatTime(currentTime)}</span>
            <span className="text-xs text-white/50">{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          ref={progressRef}
          className="h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer"
          onClick={handleSeek}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${progressPercent}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-white/60" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 accent-purple-500 cursor-pointer"
          />
        </div>
        
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, currentTime - 10);
              }
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.min(duration, currentTime + 10);
              }
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
        </div>
      </div>
      
      {/* Audio Element (hidden) */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Status Bar */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">
            {streamUrl?.includes('youtube.com') ? 'YouTube Stream' : 'Audio Stream'}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            isPlaying 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-700 text-white/60'
          }`}>
            {isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      </div>
    </div>
  );
}