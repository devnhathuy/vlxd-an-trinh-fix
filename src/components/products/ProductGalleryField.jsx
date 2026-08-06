export default function ProductGalleryField({
  galleryPreviews,
  galleryFiles,
  existingGallery,
  onRemoveGallery,
  onGalleryChange,
  onRemoveExistingGallery,
}) {
  const hasImages = galleryPreviews.length > 0 || existingGallery.length > 0;

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700">
        Ảnh chi tiết
      </label>

      <div className="mt-2 rounded-2xl border border-dashed border-slate-300 p-4">
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={onGalleryChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:font-bold file:text-primary-500"
        />
        <p className="mt-2 text-xs text-slate-500">
          Có thể chọn nhiều ảnh. Mỗi ảnh tối đa 5MB.
        </p>

        {hasImages && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {existingGallery.map((image) => (
              <GalleryItem
                key={image.id}
                src={image.image_url}
                alt="Ảnh chi tiết sản phẩm"
                onRemove={() => onRemoveExistingGallery(image.id)}
              />
            ))}

            {galleryPreviews.map((preview, index) => (
              <GalleryItem
                key={`${preview}-${index}`}
                src={preview}
                alt={`Ảnh chi tiết ${index + 1}`}
                fileName={galleryFiles[index]?.name}
                onRemove={() => onRemoveGallery(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryItem({ src, alt, fileName, onRemove }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
      <img src={src} alt={alt} className="h-28 w-full object-cover" />
      {fileName && (
        <p className="truncate px-2 py-2 text-xs text-slate-500">{fileName}</p>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
        aria-label="Xóa ảnh"
      >
        ✕
      </button>
    </div>
  );
}
