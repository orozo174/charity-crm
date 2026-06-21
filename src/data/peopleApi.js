import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { DEMO_PEOPLE } from "./demoData";

// Бул модуль "people" таблицасы менен иштешет.
// Supabase орнотулбаса, демо маалыматтар колдонулат (in-memory, убакыттык).

let demoPeopleCache = [...DEMO_PEOPLE];

/**
 * Бардык адамдарды тиешелүү aid жана медиа менен бирге алып келет.
 */
export async function fetchPeople() {
  if (!isSupabaseConfigured) {
    return { data: demoPeopleCache, error: null };
  }

  const { data, error } = await supabase
    .from("people")
    .select(`
      *,
      volunteer:volunteer_id ( id, full_name ),
      aid ( id, aid_type, amount, aid_date, notes, responsible:responsible_id ( full_name ) ),
      person_media ( id, media_type, public_url, storage_path )
    `)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  // Маалыматтарды UI'га ыңгайлуу формага которуу
  const normalized = data.map((p) => ({
    ...p,
    volunteer_name: p.volunteer?.full_name || "—",
    aid: (p.aid || []).map((a) => ({
      ...a,
      responsible_name: a.responsible?.full_name || "—",
    })),
    photos: (p.person_media || []).filter((m) => m.media_type === "photo"),
    videos: (p.person_media || []).filter((m) => m.media_type === "video"),
  }));

  return { data: normalized, error: null };
}

/**
 * Жаңы адамды базага кошот.
 */
export async function createPerson(personData) {
  if (!isSupabaseConfigured) {
    const newPerson = {
      ...personData,
      id: `demo-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
      aid: [],
      photos: [],
      volunteer_name: personData.volunteer_name || "—",
    };
    demoPeopleCache = [newPerson, ...demoPeopleCache];
    return { data: newPerson, error: null };
  }

  const { data, error } = await supabase
    .from("people")
    .insert([
      {
        name: personData.name,
        age: personData.age,
        phone: personData.phone,
        region: personData.region,
        address: personData.address,
        children: personData.children,
        family_size: personData.family_size,
        category: personData.category,
        priority: personData.priority,
        description: personData.description,
        comments: personData.description,
        volunteer_id: personData.volunteer_id || null,
        created_by: personData.created_by || null,
        status: "pending",
      },
    ])
    .select()
    .single();

  return { data, error };
}

/**
 * Адамдын статусун жаңылайт (Person Card ичинен чакырылат).
 */
export async function updatePersonStatus(personId, status) {
  if (!isSupabaseConfigured) {
    demoPeopleCache = demoPeopleCache.map((p) =>
      p.id === personId ? { ...p, status } : p
    );
    return { data: { id: personId, status }, error: null };
  }

  const { data, error } = await supabase
    .from("people")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", personId)
    .select()
    .single();

  return { data, error };
}

/**
 * Адамга жаңы комментарий кошот.
 */
export async function updatePersonComment(personId, comment) {
  if (!isSupabaseConfigured) {
    demoPeopleCache = demoPeopleCache.map((p) =>
      p.id === personId ? { ...p, comments: comment } : p
    );
    return { data: { id: personId, comments: comment }, error: null };
  }

  const { data, error } = await supabase
    .from("people")
    .update({ comments: comment })
    .eq("id", personId)
    .select()
    .single();

  return { data, error };
}
