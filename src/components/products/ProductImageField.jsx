export default function ProductImageField({ imagePreview, onImageChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700">
        Ảnh sản phẩm
      </label>

      <div className="mt-2 rounded-2xl border border-dashed border-slate-300 p-4">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onImageChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:font-bold file:text-primary-500"
        />
        <p className="mt-2 text-xs text-slate-500">
          Chấp nhận JPG, PNG hoặc WebP. Dung lượng tối đa 5MB.
        </p>

        {imagePreview && (
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <img
              src={imagePreview}
              alt="Xem trước sản phẩm"
              className="h-56 w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
