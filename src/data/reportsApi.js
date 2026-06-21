import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export async function fetchReports() {
  if (!isSupabaseConfigured) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("reports")
    .select(`
      *,
      person:person_id ( id, name ),
      volunteer:volunteer_id ( full_name ),
      report_media ( id, media_type, public_url )
    `)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  const normalized = data.map((r) => ({
    ...r,
    person_name: r.person?.name || "—",
    volunteer_name: r.volunteer?.full_name || "—",
    photos: (r.report_media || []).filter((m) => m.media_type === "photo"),
    videos: (r.report_media || []).filter((m) => m.media_type === "video"),
  }));

  return { data: normalized, error: null };
}

export async function createReport({ personId, volunteerId, comment }) {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: "Демо режимде отчет сакталбайт" } };
  }

  const { data, error } = await supabase
    .from("reports")
    .insert([{ person_id: personId, volunteer_id: volunteerId, comment }])
    .select()
    .single();

  return { data, error };
}
