"use server";

import { musicScraper, type SearchOptions, type SongResult } from "@/lib/musicScraper";

/**
 * Server Action to search music.
 * This runs on the server to avoid CORS issues and protect sensitive logic.
 */
export async function searchMusicAction(query: string, options?: SearchOptions): Promise<SongResult[]> {
  try {
    return await musicScraper.search(query, options);
  } catch (error) {
    console.error("Error in searchMusicAction:", error);
    return [];
  }
}

/**
 * Server Action to get streaming URL.
 */
export async function getMusicStreamUrlAction(videoId: string): Promise<string | null> {
  try {
    return await musicScraper.getStreamingUrl(videoId);
  } catch (error) {
    console.error("Error in getMusicStreamUrlAction:", error);
    return null;
  }
}

/**
 * Server Action to check service status.
 */
export async function checkMusicServiceStatusAction() {
  try {
    return await musicScraper.checkServiceStatus();
  } catch (error) {
    console.error("Error in checkMusicServiceStatusAction:", error);
    return {
      invidious: false,
      youtubeMusic: false,
      overall: false
    };
  }
}
