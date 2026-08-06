import { supabase } from "../lib/supabase";

const NEWS_SELECT = `
  *
`;
export async function getPublishedNewsBySlug(slug) {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;

  return data;
}
export async function getAllNews() {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .order("display_order", { ascending: true })
    .order("published_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function getPublishedNews() {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function getFeaturedNews() {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function getNewsBySlug(slug) {
  const { data, error } = await supabase
    .from("news")
    .select(NEWS_SELECT)
    .eq("slug", slug)
    .single();

  if (error) throw error;

  return data;
}

export async function createNews(news) {
  const { data, error } = await supabase
    .from("news")
    .insert(news)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateNews(id, news) {
  const { data, error } = await supabase
    .from("news")
    .update(news)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) throw error;
}