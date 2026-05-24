-- SQL Schema untuk Lingkoraq Supabase Database
-- Jalankan di SQL Editor di Supabase Dashboard

-- 1. Enable Realtime untuk tabel notes
ALTER PUBLICATION supabase_realtime ADD TABLE notes;

-- 2. Tabel notes untuk fitur catatan Instagram-style
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  music_id TEXT,
  music_title TEXT,
  music_artist TEXT,
  music_thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index untuk performa
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- 4. Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 5. Policies untuk notes
-- Pengguna hanya bisa melihat notes milik mereka sendiri
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

-- Pengguna hanya bisa membuat notes untuk diri mereka sendiri
CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pengguna hanya bisa mengupdate notes milik mereka sendiri
CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pengguna hanya bisa menghapus notes milik mereka sendiri
CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Tabel users (jika belum ada)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Policies untuk users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 9. Tabel projects (jika belum ada)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  html_code TEXT NOT NULL,
  css_code TEXT NOT NULL,
  js_code TEXT NOT NULL,
  preview_img TEXT,
  favicon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(slug, user_id) -- Memungkinkan slug sama untuk user berbeda
);

-- 10. Index untuk projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- 11. Policies untuk projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- 12. Public access untuk projects (untuk halaman publik)
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (true);

-- 13. Trigger untuk projects updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 14. Trigger untuk users updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 15. Function untuk memastikan user record ada
CREATE OR REPLACE FUNCTION ensure_user_record()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 16. Trigger untuk membuat user record otomatis
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_record();

-- 17. Function untuk mengecek apakah slug tersedia untuk user tertentu
CREATE OR REPLACE FUNCTION check_slug_availability(
  p_user_id UUID,
  p_slug TEXT,
  p_exclude_project_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  exists_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO exists_count
  FROM projects
  WHERE slug = p_slug
    AND user_id = p_user_id
    AND (p_exclude_project_id IS NULL OR id != p_exclude_project_id);
  
  RETURN exists_count = 0;
END;
$$ language 'plpgsql';