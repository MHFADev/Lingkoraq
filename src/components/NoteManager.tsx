"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Music, X, Plus, Trash2, Edit2, Play, RefreshCw } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import MusicSearchModal from "./MusicSearchModal";
import { useRealtimeNotes, type Note as RealtimeNote } from "@/lib/realtime";

interface Note {
  id: string;
  text: string;
  musicId?: string;
  musicTitle?: string;
  musicArtist?: string;
  musicThumbnail?: string;
  createdAt: Date;
}

export default function NoteManager() {
  const store = useEditorStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteText, setNoteText] = useState(store.noteText || "");
  const [showMusicSearch, setShowMusicSearch] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Inisialisasi realtime sync
  const realtimeSync = useRealtimeNotes(store.projectId || "default");

  // Load notes dari Supabase
  const loadNotes = useCallback(async () => {
    if (!store.projectId) return;
    
    setIsSyncing(true);
    try {
      const realtimeNotes = await realtimeSync.getNotes();
      const formattedNotes: Note[] = realtimeNotes.map(note => ({
        id: note.id,
        text: note.text,
        musicId: note.music_id,
        musicTitle: note.music_title,
        musicArtist: note.music_artist,
        musicThumbnail: note.music_thumbnail,
        createdAt: new Date(note.created_at),
      }));
      
      setNotes(formattedNotes);
      setLastSync(new Date());
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [store.projectId, realtimeSync]);

  // Setup realtime listeners
  useEffect(() => {
    if (!store.projectId || !isExpanded) return;

    // Connect to realtime
    realtimeSync.connect();

    // Load initial notes
    loadNotes();

    // Setup listeners for realtime updates
    const insertListenerId = realtimeSync.onInsert((newNote) => {
      const formattedNote: Note = {
        id: newNote.id,
        text: newNote.text,
        musicId: newNote.music_id,
        musicTitle: newNote.music_title,
        musicArtist: newNote.music_artist,
        musicThumbnail: newNote.music_thumbnail,
        createdAt: new Date(newNote.created_at),
      };
      setNotes(prev => [formattedNote, ...prev.filter(n => n.id !== formattedNote.id)]);
    });

    const updateListenerId = realtimeSync.onUpdate((updatedNote) => {
      const formattedNote: Note = {
        id: updatedNote.id,
        text: updatedNote.text,
        musicId: updatedNote.music_id,
        musicTitle: updatedNote.music_title,
        musicArtist: updatedNote.music_artist,
        musicThumbnail: updatedNote.music_thumbnail,
        createdAt: new Date(updatedNote.created_at),
      };
      setNotes(prev => prev.map(n => n.id === formattedNote.id ? formattedNote : n));
    });

    const deleteListenerId = realtimeSync.onDelete((deletedNote) => {
      setNotes(prev => prev.filter(n => n.id !== deletedNote.id));
    });

    // Cleanup
    return () => {
      realtimeSync.removeListener(insertListenerId);
      realtimeSync.removeListener(updateListenerId);
      realtimeSync.removeListener(deleteListenerId);
      realtimeSync.disconnect();
    };
  }, [store.projectId, isExpanded, realtimeSync, loadNotes]);

  const handleAddNote = async () => {
    if (!noteText.trim() && !store.noteMusicId) return;
    if (!store.projectId) return;

    setIsSyncing(true);
    try {
      const newNote = await realtimeSync.createNote({
        user_id: "current-user", // Akan diganti dengan user ID asli
        project_id: store.projectId,
        text: noteText,
        music_id: store.noteMusicId,
        music_title: store.noteMusicTitle,
        music_artist: store.noteMusicArtist,
        music_thumbnail: store.noteMusicThumbnail,
      });

      if (newNote) {
        setNoteText("");
        // Clear music attachment from store
        store.updateProfile({
          noteMusicId: "",
          noteMusicTitle: "",
          noteMusicArtist: "",
          noteMusicThumbnail: "",
        });
      }
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !store.projectId) return;

    setIsSyncing(true);
    try {
      const updated = await realtimeSync.updateNote(editingNote.id, {
        text: noteText,
        music_id: store.noteMusicId || editingNote.musicId,
        music_title: store.noteMusicTitle || editingNote.musicTitle,
        music_artist: store.noteMusicArtist || editingNote.musicArtist,
        music_thumbnail: store.noteMusicThumbnail || editingNote.musicThumbnail,
      });

      if (updated) {
        setEditingNote(null);
        setNoteText("");
        
        // Clear music attachment from store
        store.updateProfile({
          noteMusicId: "",
          noteMusicTitle: "",
          noteMusicArtist: "",
          noteMusicThumbnail: "",
        });
      }
    } catch (error) {
      console.error("Error updating note:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!store.projectId) return;

    setIsSyncing(true);
    try {
      const success = await realtimeSync.deleteNote(id);
      if (success) {
        // Note akan dihapus secara realtime melalui listener
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteText(note.text);
    
    // Set music attachment in store for editing
    store.updateProfile({
      noteMusicId: note.musicId || "",
      noteMusicTitle: note.musicTitle || "",
      noteMusicArtist: note.musicArtist || "",
      noteMusicThumbnail: note.musicThumbnail || "",
    });
  };

  const handleMusicSelect = (song: any) => {
    store.updateProfile({
      noteMusicId: song.id,
      noteMusicTitle: song.title,
      noteMusicArtist: song.artist,
      noteMusicThumbnail: song.thumbnail,
    });
    setShowMusicSearch(false);
  };

  const handleClearMusic = () => {
    store.updateProfile({
      noteMusicId: "",
      noteMusicTitle: "",
      noteMusicArtist: "",
      noteMusicThumbnail: "",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Music className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Notes with Music</h3>
            <p className="text-xs text-white/40">Instagram-style notes with music attachments</p>
            {lastSync && (
              <p className="text-[10px] text-white/30 mt-0.5">
                Last sync: {lastSync.toLocaleTimeString()}
                {isSyncing && " (Syncing...)"}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={loadNotes}
            disabled={isSyncing}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh notes"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            {isExpanded ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Note Input */}
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="What's on your mind? Add a note..."
                className="w-full min-h-[80px] px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/30 resize-none"
                rows={3}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <button
                  onClick={() => setShowMusicSearch(true)}
                  className="p-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors"
                  title="Add music"
                >
                  <Music className="w-3.5 h-3.5" />
                </button>
                {store.noteMusicId && (
                  <button
                    onClick={handleClearMusic}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors"
                    title="Remove music"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Music Preview */}
            {store.noteMusicId && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={store.noteMusicThumbnail}
                      alt={store.noteMusicTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Music className="w-3 h-3 text-purple-400" />
                      <span className="text-xs font-medium text-purple-300">Music Attachment</span>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{store.noteMusicTitle}</p>
                    <p className="text-xs text-white/60 truncate">{store.noteMusicArtist}</p>
                  </div>
                  <button
                    onClick={() => setShowMusicSearch(true)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    title="Change music"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={editingNote ? handleUpdateNote : handleAddNote}
                disabled={(!noteText.trim() && !store.noteMusicId) || isSyncing}
                className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  (noteText.trim() || store.noteMusicId) && !isSyncing
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                } flex items-center justify-center gap-2`}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {editingNote ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingNote ? "Update Note" : "Add Note"
                )}
              </button>
              {editingNote && (
                <button
                  onClick={() => {
                    setEditingNote(null);
                    setNoteText("");
                    handleClearMusic();
                  }}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-3 mt-4">
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Recent Notes</h4>
            {notes.length === 0 ? (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                <Music className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">No notes yet. Add your first note!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white whitespace-pre-wrap break-words">{note.text}</p>
                        
                        {note.musicId && (
                          <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={note.musicThumbnail}
                                  alt={note.musicTitle}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{note.musicTitle}</p>
                                <p className="text-xs text-white/60 truncate">{note.musicArtist}</p>
                              </div>
                              <button
                                onClick={() => {
                                  // Simulate playing the music
                                  console.log("Playing music:", note.musicId);
                                }}
                                className="p-1.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 transition-colors"
                                title="Play music"
                              >
                                <Play className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-white/30">{formatTimeAgo(note.createdAt)}</span>
                          {note.musicId && (
                            <span className="text-xs text-purple-400 flex items-center gap-1">
                              <Music className="w-3 h-3" />
                              Music attached
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                          title="Edit note"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Music Search Modal */}
      <MusicSearchModal
        isOpen={showMusicSearch}
        onClose={() => setShowMusicSearch(false)}
        onSelect={handleMusicSelect}
      />
    </div>
  );
}