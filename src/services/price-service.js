import { supabase } from "../lib/supabase";

export async function getPriceList() {
  const { data: products, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      price_note,
      unit,
      stock_status,
      status,
      updated_at,
      category_id,
      categories (
        id,
        name
      ),
      product_images (
        image_url,
        display_order,
        is_cover
      )
    `)
    .neq("status", "hidden")
    .order("name", { ascending: true });

  if (productError) {
    throw new Error(productError.message);
  }

  const { data: histories, error: historyError } = await supabase
    .from("product_price_history")
    .select(`
      product_id,
      old_price,
      new_price,
      old_price_started_at,
      changed_at
    `)
    .order("changed_at", { ascending: false });

  if (historyError) {
    throw new Error(historyError.message);
  }

  return products.map((product) => {
    const latestHistory = histories.find(
      (history) => history.product_id === product.id
    );

    const coverImage =
      product.product_images?.find((img) => img.is_cover) ??
      product.product_images?.sort(
        (a, b) => a.display_order - b.display_order
      )[0];

    const currentPrice = Number(product.price || 0);

    const oldPrice = latestHistory
      ? Number(latestHistory.old_price || 0)
      : null;

    const priceDifference =
      oldPrice !== null ? currentPrice - oldPrice : null;

    let priceDirection = "unchanged";

    if (priceDifference > 0) {
      priceDirection = "up";
    }

    if (priceDifference < 0) {
      priceDirection = "down";
    }

    return {
      ...product,

      image_url: coverImage?.image_url ?? null,

      currentPrice,
      oldPrice,

      priceDifference,
      priceDirection,

      priceUpdatedAt:
        latestHistory?.changed_at || product.updated_at,

      oldPriceStartedAt:
        latestHistory?.old_price_started_at || null,
    };
  });
}