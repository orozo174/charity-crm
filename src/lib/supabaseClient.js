import { createClient } from "@supabase/supabase-js";

// Supabase шилтемелери .env файлынан алынат.
// Долбоордун тамырында .env.local файлын түзүп, төмөнкүлөрдү толтуруңуз:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Эгер .env орнотулбаса, демо режимде иштейт (data/demoData.js колдонулат).
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// Storage бакеттеринин аттары (Supabase Storage'да алдын ала түзүлүшү керек)
export const STORAGE_BUCKETS = {
  PHOTOS: "person-photos",
  VIDEOS: "person-videos",
  REPORT_MEDIA: "report-media",
};
