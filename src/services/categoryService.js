import { supabase } from "../lib/supabase";

export async function getActiveCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      sort_order,
      is_active
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}