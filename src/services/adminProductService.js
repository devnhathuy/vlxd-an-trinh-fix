import { supabase } from "../lib/supabase";

const PRODUCT_BUCKET = "product-images";

export async function getAdminProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createAdminProduct(payload) {
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAdminProduct(productId, payload) {
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveAdminProduct({ editingId, payload }) {
  return editingId
    ? updateAdminProduct(editingId, payload)
    : createAdminProduct(payload);
}

export async function updateProductActive(productId, isActive) {
  const { data, error } = await supabase
    .from("products")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAdminProduct(productId) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) throw error;
}

export async function uploadProductImage(file) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `products/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(PRODUCT_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
