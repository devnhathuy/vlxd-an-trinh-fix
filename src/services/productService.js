import { supabase } from "../lib/supabase";

const PRODUCT_SELECT = `
  *,
  categories (
    id,
    name,
    slug
  ),
  product_images (
    id,
    image_url,
    display_order,
    is_cover
  )
`;

export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getRelatedProducts(
  categoryId,
  currentProductId,
) {
  if (!categoryId || !currentProductId) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .order("is_featured", { ascending: false })
    .order("sort_order", {
      ascending: true,
      nullsFirst: false,
    })
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getActiveProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(8);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export function formatVND(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));
}