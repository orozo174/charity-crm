import { supabase, isSupabaseConfigured, STORAGE_BUCKETS } from "../lib/supabaseClient";

/**
 * Бир файлды Supabase Storage'га жүктөйт жана public URL кайтарат.
 * @param {File} file - жүктөлүүчү файл
 * @param {"photo"|"video"} mediaType
 * @param {string} folder - мисалы person.id
 */
export async function uploadMedia(file, mediaType, folder = "general") {
  if (!isSupabaseConfigured) {
    // Демо режимде локалдык object URL колдонулат (сессия аралык сакталбайт)
    return {
      data: {
        storage_path: `demo/${file.name}`,
        public_url: URL.createObjectURL(file),
        media_type: mediaType,
      },
      error: null,
    };
  }

  const bucket = mediaType === "photo" ? STORAGE_BUCKETS.PHOTOS : STORAGE_BUCKETS.VIDEOS;
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (uploadError) return { data: null, error: uploadError };

  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return {
    data: {
      storage_path: fileName,
      public_url: publicData.publicUrl,
      media_type: mediaType,
    },
    error: null,
  };
}

/**
 * Жүктөлгөн медианы person_media таблицасына жазат.
 */
export async function attachMediaToPerson(personId, mediaType, storagePath, publicUrl, uploadedBy) {
  if (!isSupabaseConfigured) {
    return { data: { id: `demo-media-${Date.now()}` }, error: null };
  }

  const { data, error } = await supabase
    .from("person_media")
    .insert([
      {
        person_id: personId,
        media_type: mediaType,
        storage_path: storagePath,
        public_url: publicUrl,
        uploaded_by: uploadedBy,
      },
    ])
    .select()
    .single();

  return { data, error };
}

/**
 * Сүрөт/видео жүктөп, дароо адамга тиркейт. UI'дан түз чакырылат.
 */
export async function uploadAndAttachToPerson(file, mediaType, personId, uploadedBy) {
  const { data: uploadResult, error: uploadError } = await uploadMedia(file, mediaType, personId);
  if (uploadError) return { data: null, error: uploadError };

  const { data: attachResult, error: attachError } = await attachMediaToPerson(
    personId,
    mediaType,
    uploadResult.storage_path,
    uploadResult.public_url,
    uploadedBy
  );
  if (attachError) return { data: null, error: attachError };

  return { data: { ...uploadResult, ...attachResult }, error: null };
}

/**
 * Файл өлчөмүн жана түрүн текшерүү (UI'да жүктөөдөн мурун колдонулат).
 */
export function validateMediaFile(file, mediaType) {
  const maxSizes = { photo: 10 * 1024 * 1024, video: 100 * 1024 * 1024 }; // 10MB / 100MB
  const allowedTypes = {
    photo: ["image/jpeg", "image/png", "image/webp", "image/heic"],
    video: ["video/mp4", "video/quicktime", "video/webm"],
  };

  if (!allowedTypes[mediaType].includes(file.type)) {
    return { valid: false, error: mediaType === "photo"
      ? "Сүрөт PNG, JPG же WEBP форматында болушу керек"
      : "Видео MP4, MOV же WEBM форматында болушу керек" };
  }

  if (file.size > maxSizes[mediaType]) {
    const maxMb = maxSizes[mediaType] / (1024 * 1024);
    return { valid: false, error: `Файл өлчөмү ${maxMb}MB ашпашы керек` };
  }

  return { valid: true, error: null };
}
