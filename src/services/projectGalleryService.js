import { supabase } from "../lib/supabase";

function sanitizeFileName(fileName) {
  const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";

  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "project-image"}.${extension}`;
}

export async function uploadGalleryImages(projectId, files) {
  if (!projectId || !files || files.length === 0) {
    return [];
  }

  const uploadedImages = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const safeName = sanitizeFileName(file.name);

    const filePath =
      `${projectId}/${Date.now()}-${index}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("project-images")
      .getPublicUrl(filePath);

    const { data, error: insertError } = await supabase
      .from("project_gallery")
      .insert({
        project_id: projectId,
        image_url: publicUrl,
        display_order: index + 1,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    uploadedImages.push(data);
  }

  return uploadedImages;
}