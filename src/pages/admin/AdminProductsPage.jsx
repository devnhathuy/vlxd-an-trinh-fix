import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

import ProductForm from "../../components/products/ProductForm";
import ProductTable from "../../components/products/ProductTable";
import useProductForm from "../../hooks/useProductForm";
import {
  deleteAdminProduct,
  getAdminProducts,
  saveAdminProduct,
  updateProductActive,
  uploadProductImage,
} from "../../services/adminProductService";
import { getActiveCategories } from "../../services/categoryService";
import {
  deleteGalleryImageById,
  getGalleryImages,
  saveGalleryImages,
  uploadGalleryImage,
} from "../../services/productImageService";
import {
  validateImageFile,
  validateImageFiles,
} from "../../utils/fileValidation";
import { createSlug } from "../../utils/slug";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    showForm,
    setShowForm,
    editingId,
    setEditingId,
    saving,
    setSaving,
    formData,
    setFormData,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    galleryFiles,
    setGalleryFiles,
    galleryPreviews,
    setGalleryPreviews,
    existingGallery,
    setExistingGallery,
    deletedGalleryIds,
    setDeletedGalleryIds,
    resetProductForm,
    openCreateForm,
    closeForm,
    handleChange,
  } = useProductForm();

  async function fetchProducts() {
    try {
      setLoading(true);
      setProducts(await getAdminProducts());
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
      setMessage({
        type: "error",
        text: `Không thể tải sản phẩm: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      setCategories(await getActiveCategories());
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
      setMessage({
        type: "error",
        text: `Không thể tải danh mục: ${error.message}`,
      });
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  async function openEditForm(product) {
    try {
      resetProductForm();
      setEditingId(product.id);
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        category_id: product.category_id || "",
        image_url: product.image_url || "",
        unit: product.unit || "",
        price: product.price ?? "",
        price_note: product.price_note || "",
        stock_status: product.stock_status || "Còn hàng",
        badge: product.badge || "",
        is_featured: Boolean(product.is_featured),
        is_active: Boolean(product.is_active),
      });
      setImagePreview(product.image_url || "");
      setExistingGallery(await getGalleryImages(product.id));
      setShowForm(true);
    } catch (error) {
      console.error("Lỗi mở sản phẩm:", error);
      setMessage({
        type: "error",
        text: `Không thể tải ảnh chi tiết: ${error.message}`,
      });
    }
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setMessage({ type: "error", text: validation.message });
      event.target.value = "";
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage({ type: "", text: "" });
  }

  function handleGalleryChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validation = validateImageFiles(files);
    if (!validation.valid) {
      setMessage({ type: "error", text: validation.message });
      event.target.value = "";
      return;
    }

    setGalleryFiles((current) => [...current, ...files]);
    setGalleryPreviews((current) => [
      ...current,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    setMessage({ type: "", text: "" });
    event.target.value = "";
  }

  function removeGalleryPreview(index) {
    setGalleryFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );
    setGalleryPreviews((current) => {
      const preview = current[index];
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      return current.filter((_, previewIndex) => previewIndex !== index);
    });
  }

  function removeExistingImage(id) {
    setExistingGallery((current) =>
      current.filter((image) => image.id !== id),
    );
    setDeletedGalleryIds((current) =>
      current.includes(id) ? current : [...current, id],
    );
  }

  function buildPayload(imageUrl) {
    const name = formData.name.trim();
    const slug = formData.slug.trim() || createSlug(name);
    const price = formData.price === "" ? null : Number(formData.price);

    if (!name) throw new Error("Vui lòng nhập tên sản phẩm.");
    if (!slug) throw new Error("Không thể tạo đường dẫn sản phẩm.");
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
      throw new Error("Giá sản phẩm không hợp lệ.");
    }

    return {
      name,
      slug,
      category_id: formData.category_id || null,
      image_url: imageUrl || null,
      unit: formData.unit.trim() || null,
      price,
      price_note: formData.price_note.trim() || null,
      stock_status: formData.stock_status,
      badge: formData.badge.trim() || null,
      is_featured: Boolean(formData.is_featured),
      is_active: Boolean(formData.is_active),
      updated_at: new Date().toISOString(),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const imageUrl = imageFile
        ? await uploadProductImage(imageFile)
        : formData.image_url;

      const savedProduct = await saveAdminProduct({
        editingId,
        payload: buildPayload(imageUrl),
      });

      if (deletedGalleryIds.length > 0) {
        await Promise.all(
          deletedGalleryIds.map((id) => deleteGalleryImageById(id)),
        );
      }

      if (galleryFiles.length > 0) {
        const imageUrls = await Promise.all(
          galleryFiles.map((file) => uploadGalleryImage(file)),
        );
        await saveGalleryImages(savedProduct.id, imageUrls);
      }

      setMessage({
        type: "success",
        text: editingId ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.",
      });
      setShowForm(false);
      resetProductForm();
      await fetchProducts();
    } catch (error) {
      console.error("Lỗi lưu sản phẩm:", error);
      setMessage({
        type: "error",
        text: error.message || "Không thể lưu sản phẩm.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(product) {
    try {
      const updatedProduct = await updateProductActive(
        product.id,
        !product.is_active,
      );
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? updatedProduct : item,
        ),
      );
      setMessage({
        type: "success",
        text: updatedProduct.is_active
          ? "Đã hiển thị sản phẩm."
          : "Đã ẩn sản phẩm.",
      });
    } catch (error) {
      console.error("Lỗi đổi trạng thái:", error);
      setMessage({
        type: "error",
        text: `Không thể đổi trạng thái: ${error.message}`,
      });
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Bạn chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }

    try {
      setDeletingId(product.id);
      await deleteAdminProduct(product.id);
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
      setMessage({ type: "success", text: "Đã xóa sản phẩm." });
    } catch (error) {
      console.error("Lỗi xóa sản phẩm:", error);
      setMessage({
        type: "error",
        text: `Không thể xóa sản phẩm: ${error.message}`,
      });
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return products;

    return products.filter((product) =>
      [product.name, product.slug, product.unit].some((value) =>
        value?.toLowerCase().includes(keyword),
      ),
    );
  }, [products, searchTerm]);

  function handleOpenCreateForm() {
    setMessage({ type: "", text: "" });
    openCreateForm();
  }

  function handleCloseForm() {
    setMessage({ type: "", text: "" });
    closeForm();
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <Link
              to="/admin"
              className="mb-1 inline-flex items-center text-sm font-bold text-primary-500"
            >
              <ArrowLeft className="mr-2" size={17} />
              Quay lại trang quản trị
            </Link>
            <h1 className="text-xl font-extrabold text-slate-900">
              Quản lý sản phẩm
            </h1>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateForm}
            className="inline-flex items-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
          >
            <Plus className="mr-2" size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message.text && (
          <p
            className={`mb-5 rounded-xl p-4 text-sm font-semibold ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Danh sách sản phẩm
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tổng cộng {products.length} sản phẩm.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary-500 md:w-80"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center font-semibold text-slate-500">
              Đang tải sản phẩm...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              Chưa có sản phẩm.
            </div>
          ) : (
            <ProductTable
              products={filteredProducts}
              deletingId={deletingId}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          )}
        </div>
      </section>

      <ProductForm
        showForm={showForm}
        editingId={editingId}
        saving={saving}
        formData={formData}
        imagePreview={imagePreview}
        galleryFiles={galleryFiles}
        galleryPreviews={galleryPreviews}
        existingGallery={existingGallery}
        categories={categories}
        onChange={handleChange}
        onImageChange={handleImageChange}
        onGalleryChange={handleGalleryChange}
        onRemoveGallery={removeGalleryPreview}
        onRemoveExistingGallery={removeExistingImage}
        onSubmit={handleSubmit}
        onClose={handleCloseForm}
      />
    </main>
  );
}
