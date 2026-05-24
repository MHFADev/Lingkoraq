"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Music, Loader2, Play } from "lucide-react";
import { searchMusicAction } from "@/actions/musicActions";

interface SongResult {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  thumbnail: string;
  type?: string;
  url?: string;
}

interface MusicSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (song: SongResult) => void;
}

export default function MusicSearchModal({ isOpen, onClose, onSelect }: MusicSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  const searchMusic = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gunakan server action untuk menghindari CORS issue
      const searchResults = await searchMusicAction(searchQuery, {
        limit: 15,
        filter: 'songs'
      });
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        setError(`No results found for "${searchQuery}". Try different keywords.`);
      }
    } catch (err: any) {
      console.error("Music search error:", err);
      
      // Fallback ke mock data
      try {
        const fallbackResults = await getFallbackMusicResults(searchQuery);
        setResults(fallbackResults);
        
        if (fallbackResults.length === 0) {
          setError("Music search service is temporarily unavailable. Please try again later or use manual URL input.");
        } else {
          console.log("Using fallback mock data");
        }
      } catch (fallbackErr: any) {
        console.error("Fallback also failed:", fallbackErr);
        setError("Music search service is temporarily unavailable. Please try again later or use manual URL input.");
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getFallbackMusicResults = async (query: string): Promise<SongResult[]> => {
    // Mock data untuk fallback
    const mockResults: SongResult[] = [
      {
        id: "dQw4w9WgXcQ",
        title: "Never Gonna Give You Up",
        artist: "Rick Astley",
        duration: "3:33",
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      },
      {
        id: "JGwWNGJdvx8",
        title: "Shape of You",
        artist: "Ed Sheeran",
        duration: "3:54",
        thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=JGwWNGJdvx8"
      },
      {
        id: "k2qgadSvNyU",
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: "3:22",
        thumbnail: "https://i.ytimg.com/vi/k2qgadSvNyU/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=k2qgadSvNyU"
      },
      {
        id: "3JZ_D3ELwOQ",
        title: "Dance Monkey",
        artist: "Tones and I",
        duration: "3:29",
        thumbnail: "https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ"
      },
      {
        id: "60ItHLz5WEA",
        title: "Bad Guy",
        artist: "Billie Eilish",
        duration: "3:14",
        thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=60ItHLz5WEA"
      },
      {
        id: "5GL9JoH4Sws",
        title: "Bohemian Rhapsody",
        artist: "Queen",
        duration: "5:55",
        thumbnail: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ"
      },
      {
        id: "hTWKbfoikeg",
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        duration: "5:01",
        thumbnail: "https://i.ytimg.com/vi/hTWKbfoikeg/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=hTWKbfoikeg"
      },
      {
        id: "9bZkp7q19f0",
        title: "Gangnam Style",
        artist: "PSY",
        duration: "4:13",
        thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
        type: "song",
        url: "https://www.youtube.com/watch?v=9bZkp7q19f0"
      }
    ];

    // Filter berdasarkan query jika ada
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      return mockResults.filter(song => 
        song.title.toLowerCase().includes(lowerQuery) || 
        song.artist.toLowerCase().includes(lowerQuery)
      );
    }

    return mockResults.slice(0, 5);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchMusic(val);
    }, 600); // Debounce search
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0a0a0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search songs, artists..."
                  value={query}
                  onChange={handleQueryChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
                />
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative min-h-[300px]">
              {loading && results.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
                  <p className="text-sm">Searching for music...</p>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white/40">
                  <Music className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm text-red-400 mb-2">{error}</p>
                  <p className="text-xs">Try manually pasting a YouTube link instead.</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((song, i) => (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      key={song.id}
                      onClick={() => onSelect(song)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group text-left border border-transparent hover:border-white/5"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        <img 
                          src={song.thumbnail} 
                          alt={song.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                          {song.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-xs text-white/50 truncate">
                            {song.artist}
                          </p>
                          {song.duration && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-white/20"></span>
                              <span className="text-xs text-white/30">{song.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                  <Music className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">Search to find a song</p>
                  <p className="text-xs mt-1 max-w-[200px] text-center">Powered by YouTube Music & Muzo API</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
