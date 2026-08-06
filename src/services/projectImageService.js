import { supabase } from "../lib/supabase";

export async function uploadProjectImage(file) {
  if (!file) {
    return null;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${extension}`;

  const filePath = `projects/${fileName}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("project-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}