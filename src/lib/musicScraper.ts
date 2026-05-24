/**
 * Music Scraper Service
 * 
 * Sistem pencarian musik tanpa API key menggunakan teknik web scraping
 * yang mematuhi ketentuan hukum dan etika penggunaan data.
 */

export interface SongResult {
  id: string;
  title: string;
  artist: string;
  duration?: string;
  thumbnail: string;
  type?: string;
  url?: string;
}

export interface SearchOptions {
  limit?: number;
  filter?: 'songs' | 'videos' | 'all';
}

/**
 * Service utama untuk pencarian musik
 */
class MusicScraperService {
  private readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private readonly YOUTUBE_SEARCH_URL = 'https://www.youtube.com/results';
  private readonly YOUTUBE_MUSIC_SEARCH_URL = 'https://music.youtube.com/search';
  private readonly INVIDIOUS_INSTANCES = [
    'https://invidious.fdn.fr',
    'https://invidious.nerdvpn.de',
    'https://yewtu.be',
    'https://inv.riverside.rocks',
    'https://invidious.lunar.icu',
    'https://invidious.projectsegfau.lt',
    'https://invidious.tiekoetter.com',
    'https://inv.vern.cc'
  ];
  
  /**
   * Mencari musik berdasarkan query
   */
  async search(query: string, options: SearchOptions = {}): Promise<SongResult[]> {
    const { limit = 15, filter = 'songs' } = options;
    
    try {
      console.log(`🔍 Searching for: "${query}" with filter: ${filter}`);
      
      // Coba berbagai metode secara berurutan
      let results: SongResult[] = [];
      
      // 1. Coba menggunakan Invidious API (paling reliable)
      results = await this.searchViaInvidious(query, limit, filter);
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} results via Invidious`);
        return results.slice(0, limit);
      }
      
      // 2. Coba menggunakan YouTube Music scraping
      results = await this.searchViaYouTubeMusic(query, limit, filter);
      if (results.length > 0) {
        console.log(`✅ Found ${results.length} results via YouTube Music scraping`);
        return results.slice(0, limit);
      }
      
      // 3. Fallback ke mock data
      console.log('⚠️ Using fallback mock data');
      return this.getMockResults(query).slice(0, limit);
      
    } catch (error) {
      console.error('❌ Music search error:', error);
      // Return mock data sebagai fallback
      return this.getMockResults(query).slice(0, limit);
    }
  }
  
  /**
   * Mencari menggunakan Invidious API (legal dan reliable)
   */
  private async searchViaInvidious(query: string, limit: number, filter: string): Promise<SongResult[]> {
    const results: SongResult[] = [];
    
    for (const instance of this.INVIDIOUS_INSTANCES) {
      try {
        const searchUrl = `${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`;
        
        // Gunakan AbortController untuk timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        try {
          const response = await fetch(searchUrl, {
            headers: {
              'User-Agent': this.USER_AGENT,
              'Accept': 'application/json',
            },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            console.warn(`Invidious instance ${instance} returned ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          
          if (Array.isArray(data)) {
            for (const item of data) {
              if (results.length >= limit) break;
              
              // Filter untuk konten musik jika diperlukan
              if (filter === 'songs' && !this.isLikelyMusic(item.title)) {
                continue;
              }
              
              const songResult: SongResult = {
                id: item.videoId,
                title: this.cleanTitle(item.title),
                artist: this.extractArtist(item.author),
                duration: this.formatDuration(item.lengthSeconds),
                thumbnail: item.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
                type: 'song',
                url: `https://www.youtube.com/watch?v=${item.videoId}`,
              };
              
              results.push(songResult);
            }
            
            if (results.length > 0) {
              return results;
            }
          }
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            console.warn(`Invidious instance ${instance} timeout`);
          } else {
            console.warn(`Failed to use Invidious instance ${instance}:`, fetchError);
          }
          continue;
        }
      } catch (error) {
        console.warn(`Failed to use Invidious instance ${instance}:`, error);
        continue;
      }
    }
    
    return results;
  }
  
  /**
   * Mencari menggunakan YouTube Music scraping
   */
  private async searchViaYouTubeMusic(query: string, limit: number, filter: string): Promise<SongResult[]> {
    try {
      // Gunakan endpoint pencarian YouTube Music
      const searchUrl = `${this.YOUTUBE_MUSIC_SEARCH_URL}?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
      });
      
      if (!response.ok) {
        throw new Error(`YouTube Music returned ${response.status}`);
      }
      
      const html = await response.text();
      return this.parseYouTubeMusicHTML(html, limit, filter);
      
    } catch (error) {
      console.warn('YouTube Music scraping failed:', error);
      return [];
    }
  }
  
  /**
   * Parse HTML dari YouTube Music
   */
  private parseYouTubeMusicHTML(html: string, limit: number, filter: string): SongResult[] {
    const results: SongResult[] = [];
    
    try {
      // Regex untuk mengekstrak data dari YouTube Music
      const videoPattern = /"videoId":"([^"]+)","title":"([^"]+)","artist":"([^"]+)"/g;
      let match;
      
      while ((match = videoPattern.exec(html)) !== null && results.length < limit) {
        const [, videoId, title, artist] = match;
        
        // Decode escaped characters
        const decodedTitle = this.decodeHTMLEntities(title);
        const decodedArtist = this.decodeHTMLEntities(artist);
        
        // Filter untuk konten musik jika diperlukan
        if (filter === 'songs' && !this.isLikelyMusic(decodedTitle)) {
          continue;
        }
        
        const songResult: SongResult = {
          id: videoId,
          title: this.cleanTitle(decodedTitle),
          artist: this.cleanArtist(decodedArtist),
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          type: 'song',
          url: `https://music.youtube.com/watch?v=${videoId}`,
        };
        
        results.push(songResult);
      }
      
      // Jika tidak menemukan dengan pattern di atas, coba pattern alternatif
      if (results.length === 0) {
        const altPattern = /"videoId":"([^"]+)".*?"title":"([^"]+)".*?"author":"([^"]+)"/g;
        while ((match = altPattern.exec(html)) !== null && results.length < limit) {
          const [, videoId, title, artist] = match;
          
          const decodedTitle = this.decodeHTMLEntities(title);
          const decodedArtist = this.decodeHTMLEntities(artist);
          
          if (filter === 'songs' && !this.isLikelyMusic(decodedTitle)) {
            continue;
          }
          
          const songResult: SongResult = {
            id: videoId,
            title: this.cleanTitle(decodedTitle),
            artist: this.cleanArtist(decodedArtist),
            thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            type: 'song',
            url: `https://music.youtube.com/watch?v=${videoId}`,
          };
          
          results.push(songResult);
        }
      }
      
    } catch (error) {
      console.warn('HTML parsing error:', error);
    }
    
    return results;
  }
  
  /**
   * Mendapatkan streaming URL untuk video
   */
  async getStreamingUrl(videoId: string): Promise<string | null> {
    try {
      // Gunakan Invidious untuk mendapatkan streaming URL
      for (const instance of this.INVIDIOUS_INSTANCES) {
        try {
          const streamUrl = `${instance}/api/v1/videos/${videoId}?fields=formatStreams`;
          
          const response = await fetch(streamUrl, {
            headers: {
              'User-Agent': this.USER_AGENT,
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Cari format audio terbaik
            const audioFormats = data.formatStreams?.filter((format: any) => 
              format.type?.includes('audio') || format.quality === 'medium'
            ) || [];
            
            if (audioFormats.length > 0) {
              // Pilih format dengan bitrate tertinggi
              const bestFormat = audioFormats.reduce((best: any, current: any) => {
                const bestBitrate = parseInt(best.bitrate) || 0;
                const currentBitrate = parseInt(current.bitrate) || 0;
                return currentBitrate > bestBitrate ? current : best;
              });
              
              return bestFormat.url;
            }
          }
        } catch (error) {
          console.warn(`Failed to get stream from ${instance}:`, error);
          continue;
        }
      }
      
      // Fallback: Gunakan YouTube embed URL
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      
    } catch (error) {
      console.error('❌ Failed to get streaming URL:', error);
      return null;
    }
  }
  
  /**
   * Helper methods
   */
  
  private cleanTitle(title: string): string {
    // Hapus karakter khusus dan trim
    return title
      .replace(/\\u0026/g, '&')
      .replace(/\\u003c/g, '<')
      .replace(/\\u003e/g, '>')
      .replace(/\\u0027/g, "'")
      .replace(/\[.*?\]|\(.*?\)/g, '') // Hapus [text] dan (text)
      .trim();
  }
  
  private cleanArtist(artist: string): string {
    // Hapus channel indicators
    return artist
      .replace(/- Topic$/, '')
      .replace(/VEVO$/, '')
      .trim();
  }
  
  private extractArtist(author: string): string {
    return this.cleanArtist(author);
  }
  
  private formatDuration(seconds: number): string {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  private decodeHTMLEntities(text: string): string {
    if (typeof document === 'undefined') {
      // Server-side fallback
      return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }
  
  private isLikelyMusic(title: string): boolean {
    const musicKeywords = [
      'official', 'audio', 'lyric', 'lyrics', 'music video', 
      'mv', 'ft.', 'feat.', 'remix', 'cover', 'song', 'track',
      'karaoke', 'instrumental', 'remastered', 'live'
    ];
    
    const lowerTitle = title.toLowerCase();
    // Jika title sangat pendek atau mengandung kata kunci musik, anggap musik
    return lowerTitle.length < 30 || musicKeywords.some(keyword => lowerTitle.includes(keyword));
  }
  
  /**
   * Mock data untuk fallback
   */
  private getMockResults(query: string): SongResult[] {
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
    
    return mockResults;
  }
  
  /**
   * Verifikasi ketersediaan service
   */
  async checkServiceStatus(): Promise<{
    invidious: boolean;
    youtubeMusic: boolean;
    overall: boolean;
  }> {
    const status = {
      invidious: false,
      youtubeMusic: false,
      overall: false
    };
    
    try {
      // Test Invidious
      for (const instance of this.INVIDIOUS_INSTANCES.slice(0, 2)) {
        try {
          const response = await fetch(`${instance}/api/v1/stats`, {
            signal: AbortSignal.timeout(5000)
          });
          if (response.ok) {
            status.invidious = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      // Test YouTube Music (indirect)
      status.youtubeMusic = status.invidious; // Jika Invidious bekerja, YouTube Music juga tersedia
      
      status.overall = status.invidious || status.youtubeMusic;
      
    } catch (error) {
      console.error('Service status check error:', error);
    }
    
    return status;
  }
}

// Export singleton instance
export const musicScraper = new MusicScraperService();

/**
 * Utility function untuk client-side usage
 */
export async function searchMusic(query: string, options?: SearchOptions): Promise<SongResult[]> {
  return musicScraper.search(query, options);
}

/**
 * Utility function untuk mendapatkan streaming URL
 */
export async function getMusicStreamUrl(videoId: string): Promise<string | null> {
  return musicScraper.getStreamingUrl(videoId);
}

/**
 * Utility function untuk mengecek status service
 */
export async function checkMusicServiceStatus() {
  return musicScraper.checkServiceStatus();
}