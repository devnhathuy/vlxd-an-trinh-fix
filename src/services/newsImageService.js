import { supabase } from "../lib/supabase";

export async function uploadNewsImage(file) {
  if (!file) return null;

  const extension = file.name.split(".").pop();

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const filePath = fileName;

  const { error } = await supabase.storage
    .from("news-images")
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("news-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}