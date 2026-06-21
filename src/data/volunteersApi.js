import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { DEMO_VOLUNTEERS } from "./demoData";

export async function fetchVolunteers() {
  if (!isSupabaseConfigured) {
    return { data: DEMO_VOLUNTEERS, error: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  // Ар бир волонтер үчүн статистиканы эсептөө
  const { data: peopleCounts } = await supabase
    .from("people")
    .select("volunteer_id");

  const { data: aidCounts } = await supabase
    .from("aid")
    .select("responsible_id");

  const normalized = data.map((v) => ({
    ...v,
    addedPeople: peopleCounts?.filter((p) => p.volunteer_id === v.id).length || 0,
    completedAid: aidCounts?.filter((a) => a.responsible_id === v.id).length || 0,
  }));

  return { data: normalized, error: null };
}
