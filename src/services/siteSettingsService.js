import { supabase } from "../lib/supabase";

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    throw new Error(
      `Không thể tải thông tin website: ${error.message}`
    );
  }

  return data;
}