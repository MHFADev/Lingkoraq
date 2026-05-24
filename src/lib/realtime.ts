import { createClientBrowser } from "./supabaseBrowser";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface Note {
  id: string;
  user_id: string;
  project_id: string | null;
  text: string;
  music_id?: string;
  music_title?: string;
  music_artist?: string;
  music_thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export class RealtimeNoteSync {
  private channel: RealtimeChannel | null = null;
  private supabase = createClientBrowser();
  private listeners: Map<string, (note: Note) => void> = new Map();

  constructor(private projectId: string) {}

  async connect() {
    if (this.channel) return;

    this.channel = this.supabase
      .channel(`notes:${this.projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `project_id=eq.${this.projectId}`,
        },
        (payload) => {
          this.handleChange(payload);
        }
      )
      .subscribe();

    console.log(`Connected to realtime channel for project ${this.projectId}`);
  }

  disconnect() {
    if (this.channel) {
      this.supabase.removeChannel(this.channel);
      this.channel = null;
      console.log(`Disconnected from realtime channel for project ${this.projectId}`);
    }
  }

  private handleChange(payload: any) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case "INSERT":
        this.notifyListeners("insert", newRecord as Note);
        break;
      case "UPDATE":
        this.notifyListeners("update", newRecord as Note);
        break;
      case "DELETE":
        this.notifyListeners("delete", oldRecord as Note);
        break;
    }
  }

  private notifyListeners(event: string, note: Note) {
    this.listeners.forEach((callback, key) => {
      if (key.startsWith(event) || key === "all") {
        callback(note);
      }
    });
  }

  onInsert(callback: (note: Note) => void): string {
    const id = `insert-${Date.now()}`;
    this.listeners.set(id, callback);
    return id;
  }

  onUpdate(callback: (note: Note) => void): string {
    const id = `update-${Date.now()}`;
    this.listeners.set(id, callback);
    return id;
  }

  onDelete(callback: (note: Note) => void): string {
    const id = `delete-${Date.now()}`;
    this.listeners.set(id, callback);
    return id;
  }

  onAllChanges(callback: (note: Note) => void): string {
    const id = `all-${Date.now()}`;
    this.listeners.set(id, callback);
    return id;
  }

  removeListener(id: string) {
    this.listeners.delete(id);
  }

  async getNotes(): Promise<Note[]> {
    const { data, error } = await this.supabase
      .from("notes")
      .select("*")
      .eq("project_id", this.projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return [];
    }

    return data || [];
  }

  async createNote(note: Omit<Note, "id" | "created_at" | "updated_at">): Promise<Note | null> {
    const { data, error } = await this.supabase
      .from("notes")
      .insert([note])
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
      return null;
    }

    return data;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const { data, error } = await this.supabase
      .from("notes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating note:", error);
      return null;
    }

    return data;
  }

  async deleteNote(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
      return false;
    }

    return true;
  }
}

// Hook untuk menggunakan realtime sync di komponen React
export function useRealtimeNotes(projectId: string) {
  const sync = new RealtimeNoteSync(projectId);

  return {
    connect: () => sync.connect(),
    disconnect: () => sync.disconnect(),
    getNotes: () => sync.getNotes(),
    createNote: (note: Omit<Note, "id" | "created_at" | "updated_at">) => sync.createNote(note),
    updateNote: (id: string, updates: Partial<Note>) => sync.updateNote(id, updates),
    deleteNote: (id: string) => sync.deleteNote(id),
    onInsert: (callback: (note: Note) => void) => sync.onInsert(callback),
    onUpdate: (callback: (note: Note) => void) => sync.onUpdate(callback),
    onDelete: (callback: (note: Note) => void) => sync.onDelete(callback),
    onAllChanges: (callback: (note: Note) => void) => sync.onAllChanges(callback),
    removeListener: (id: string) => sync.removeListener(id),
  };
}