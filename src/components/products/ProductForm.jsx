import { X } from "lucide-react";

import { PRODUCT_STATUS_OPTIONS } from "../../constants/product";
import ProductGalleryField from "./ProductGalleryField";
import ProductImageField from "./ProductImageField";

export default function ProductForm({
  showForm,
  editingId,
  saving,
  formData,

  imagePreview,
  galleryFiles,
  galleryPreviews,
  existingGallery,

  categories,

  onChange,
  onImageChange,
  onGalleryChange,
  onRemoveGallery,
  onRemoveExistingGallery,

  onSubmit,
  onClose,
}) {
  if (!showForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Nhập thông tin sản phẩm bên dưới.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"
            aria-label="Đóng biểu mẫu"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <ProductImageField
            imagePreview={imagePreview}
            onImageChange={onImageChange}
          />

          <ProductGalleryField
            galleryPreviews={galleryPreviews}
            galleryFiles={galleryFiles}
            existingGallery={existingGallery}
            onGalleryChange={onGalleryChange}
            onRemoveGallery={onRemoveGallery}
            onRemoveExistingGallery={onRemoveExistingGallery}
          />

          <label className="block text-sm font-bold text-slate-700">
            Tên sản phẩm *
            <input
              required
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Xi măng Hà Tiên PCB40"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
            />
          </label>

          <label className="block text-sm font-bold text-slate-700">
            Slug
            <input
              name="slug"
              value={formData.slug}
              onChange={onChange}
              placeholder="xi-mang-ha-tien-pcb40"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
            />
          </label>

          <label className="block text-sm font-bold text-slate-700">
            Danh mục
            <select
              name="category_id"
              value={formData.category_id}
              onChange={onChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-primary-500"
            >
              <option value="">Chọn danh mục</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">
              Đơn vị
              <input
                name="unit"
                value={formData.unit}
                onChange={onChange}
                placeholder="Bao 50kg"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
              />
            </label>

            <label className="block text-sm font-bold text-slate-700">
              Giá
              <input
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={onChange}
                placeholder="92000"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
              />
            </label>
          </div>

          <label className="block text-sm font-bold text-slate-700">
            Ghi chú giá
            <input
              name="price_note"
              value={formData.price_note}
              onChange={onChange}
              placeholder="Giá thay đổi theo số lượng"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">
              Trạng thái kho
              <select
                name="stock_status"
                value={formData.stock_status}
                onChange={onChange}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-primary-500"
              >
                {PRODUCT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-bold text-slate-700">
              Nhãn sản phẩm
              <input
                name="badge"
                value={formData.badge}
                onChange={onChange}
                placeholder="Bán chạy"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={onChange}
              />
              Sản phẩm nổi bật
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={onChange}
              />
              Hiển thị trên website
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
            >
              {saving
                ? "Đang lưu..."
                : editingId
                  ? "Lưu thay đổi"
                  : "Thêm sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}