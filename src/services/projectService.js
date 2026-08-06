import { supabase } from "../lib/supabase";

/* Trang public: chỉ lấy dự án đang hiển thị */
export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

/* Trang admin: lấy cả dự án hiện và ẩn */
export async function getAllProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function createProject(projectData) {
  const { data, error } = await supabase
    .from("projects")
    .insert(projectData)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateProject(id, projectData) {
  const { data, error } = await supabase
    .from("projects")
    .update(projectData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
}