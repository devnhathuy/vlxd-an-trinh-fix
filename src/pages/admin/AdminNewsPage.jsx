import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import {
  createNews,
  deleteNews,
  getAllNews,
  updateNews,
} from "../../services/newsService";

import { uploadNewsImage } from "../../services/newsImageService";

const emptyForm = {
  title: "",
  slug: "",
  thumbnail: "",
  summary: "",
  content: "",
  category: "",
  published_at: "",
  reading_time: "",
  is_featured: false,
  display_order: 0,
  status: "draft",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(value) {
  if (!value) return "Chưa đăng";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function convertToDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(date.getTime() - timezoneOffset);

  return localDate.toISOString().slice(0, 16);
}

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      setLoading(true);

      const data = await getAllNews();

      setNewsList(data);
    } catch (error) {
      console.error("Lỗi tải tin tức:", error);

      setMessage({
        type: "error",
        text: `Không thể tải danh sách bài viết: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => {
      const nextValue = type === "checkbox" ? checked : value;

      const nextForm = {
        ...current,
        [name]: nextValue,
      };

      if (
        name === "title" &&
        (!editingId || current.slug === createSlug(current.title))
      ) {
        nextForm.slug = createSlug(value);
      }

      return nextForm;
    });
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(formData.thumbnail || "");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Vui lòng chọn đúng file hình ảnh.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "Ảnh thumbnail không được vượt quá 5MB.",
      });
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);

    setMessage({
      type: "",
      text: "",
    });
  }

  function openCreateForm() {
    setEditingId(null);

    setFormData({
      ...emptyForm,
      published_at: "",
    });

    setImageFile(null);
    setImagePreview("");

    setMessage({
      type: "",
      text: "",
    });

    setShowForm(true);
  }

  function openEditForm(news) {
    setEditingId(news.id);

    setFormData({
      title: news.title || "",
      slug: news.slug || "",
      thumbnail: news.thumbnail || "",
      summary: news.summary || "",
      content: news.content || "",
      category: news.category || "",
      published_at: convertToDateTimeLocal(news.published_at),
      reading_time: news.reading_time ?? "",
      is_featured: Boolean(news.is_featured),
      display_order: news.display_order ?? 0,
      status: news.status || "draft",
    });

    setImageFile(null);
    setImagePreview(news.thumbnail || "");

    setMessage({
      type: "",
      text: "",
    });

    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);

    setImageFile(null);
    setImagePreview("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const title = formData.title.trim();
    const slug = formData.slug.trim() || createSlug(title);

    if (!title) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập tiêu đề bài viết.",
      });
      return;
    }

    if (!slug) {
      setMessage({
        type: "error",
        text: "Không thể tạo đường dẫn bài viết.",
      });
      return;
    }

    if (!formData.summary.trim()) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập mô tả ngắn.",
      });
      return;
    }

    if (!formData.content.trim()) {
      setMessage({
        type: "error",
        text: "Vui lòng nhập nội dung bài viết.",
      });
      return;
    }

    const parsedReadingTime =
      formData.reading_time === ""
        ? null
        : Number(formData.reading_time);

    if (
      parsedReadingTime !== null &&
      (!Number.isInteger(parsedReadingTime) || parsedReadingTime < 1)
    ) {
      setMessage({
        type: "error",
        text: "Thời gian đọc phải là số nguyên lớn hơn 0.",
      });
      return;
    }

    const parsedDisplayOrder =
      formData.display_order === ""
        ? 0
        : Number(formData.display_order);

    if (
      !Number.isInteger(parsedDisplayOrder) ||
      parsedDisplayOrder < 0
    ) {
      setMessage({
        type: "error",
        text: "Thứ tự hiển thị phải là số nguyên từ 0 trở lên.",
      });
      return;
    }

    try {
      setSaving(true);

      setMessage({
        type: "",
        text: "",
      });

      let thumbnail = formData.thumbnail || null;

      if (imageFile) {
        thumbnail = await uploadNewsImage(imageFile);
      }

      let publishedAt = formData.published_at
        ? new Date(formData.published_at).toISOString()
        : null;

      if (formData.status === "published" && !publishedAt) {
        publishedAt = new Date().toISOString();
      }

      const payload = {
        title,
        slug,
        thumbnail,
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        category: formData.category.trim() || null,
        published_at: publishedAt,
        reading_time: parsedReadingTime,
        is_featured: formData.is_featured,
        display_order: parsedDisplayOrder,
        status: formData.status,
      };

      if (editingId) {
        await updateNews(editingId, payload);

        setMessage({
          type: "success",
          text: "Đã cập nhật bài viết.",
        });
      } else {
        await createNews(payload);

        setMessage({
          type: "success",
          text: "Đã thêm bài viết mới.",
        });
      }

      closeForm();
      await loadNews();
    } catch (error) {
      console.error("Lỗi lưu bài viết:", error);

      const isDuplicateSlug =
        error.code === "23505" ||
        error.message?.toLowerCase().includes("duplicate");

      setMessage({
        type: "error",
        text: isDuplicateSlug
          ? "Slug đã tồn tại. Vui lòng sử dụng slug khác."
          : `Không thể lưu bài viết: ${error.message}`,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleFeatured(news) {
    try {
      const updatedNews = await updateNews(news.id, {
        is_featured: !news.is_featured,
      });

      setNewsList((current) =>
        current.map((item) =>
          item.id === news.id ? updatedNews : item,
        ),
      );

      setMessage({
        type: "success",
        text: updatedNews.is_featured
          ? "Đã đặt bài viết làm nổi bật."
          : "Đã bỏ trạng thái nổi bật.",
      });
    } catch (error) {
      console.error("Lỗi đổi trạng thái nổi bật:", error);

      setMessage({
        type: "error",
        text: `Không thể đổi trạng thái nổi bật: ${error.message}`,
      });
    }
  }

  async function handleToggleStatus(news) {
    const nextStatus =
      news.status === "published" ? "draft" : "published";

    const payload = {
      status: nextStatus,
    };

    if (nextStatus === "published" && !news.published_at) {
      payload.published_at = new Date().toISOString();
    }

    try {
      const updatedNews = await updateNews(news.id, payload);

      setNewsList((current) =>
        current.map((item) =>
          item.id === news.id ? updatedNews : item,
        ),
      );

      setMessage({
        type: "success",
        text:
          nextStatus === "published"
            ? "Đã xuất bản bài viết."
            : "Đã chuyển bài viết về bản nháp.",
      });
    } catch (error) {
      console.error("Lỗi đổi trạng thái bài viết:", error);

      setMessage({
        type: "error",
        text: `Không thể đổi trạng thái: ${error.message}`,
      });
    }
  }

  async function handleDelete(news) {
    const confirmed = window.confirm(
      `Bạn chắc chắn muốn xóa bài viết "${news.title}"?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(news.id);

      await deleteNews(news.id);

      setNewsList((current) =>
        current.filter((item) => item.id !== news.id),
      );

      setMessage({
        type: "success",
        text: "Đã xóa bài viết.",
      });
    } catch (error) {
      console.error("Lỗi xóa bài viết:", error);

      setMessage({
        type: "error",
        text: `Không thể xóa bài viết: ${error.message}`,
      });
    } finally {
      setDeletingId(null);
    }
  }

  const filteredNews = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return newsList;

    return newsList.filter((news) => {
      return (
        news.title?.toLowerCase().includes(keyword) ||
        news.slug?.toLowerCase().includes(keyword) ||
        news.category?.toLowerCase().includes(keyword) ||
        news.summary?.toLowerCase().includes(keyword)
      );
    });
  }, [newsList, searchTerm]);

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
              Quản lý tin tức
            </h1>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
          >
            <Plus className="mr-2" size={18} />
            Thêm bài viết
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
                Danh sách bài viết
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tổng cộng {newsList.length} bài viết.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Tìm bài viết..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-primary-500 md:w-80"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center font-semibold text-slate-500">
              Đang tải bài viết...
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              Chưa có bài viết.
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-4">Bài viết</th>
                    <th className="px-4 py-4">Danh mục</th>
                    <th className="px-4 py-4">Ngày đăng</th>
                    <th className="px-4 py-4">Thời gian đọc</th>
                    <th className="px-4 py-4">Nổi bật</th>
                    <th className="px-4 py-4">Trạng thái</th>
                    <th className="px-4 py-4 text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNews.map((news) => (
                    <tr
                      key={news.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-4 py-5">
                        <div className="flex min-w-80 items-center gap-4">
                          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            {news.thumbnail ? (
                              <img
                                src={news.thumbnail}
                                alt={news.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center px-2 text-center text-xs font-bold text-slate-400">
                                Chưa có ảnh
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="line-clamp-2 font-bold text-slate-900">
                              {news.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              /{news.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 text-sm font-semibold text-slate-600">
                        {news.category || "Chưa phân loại"}
                      </td>

                      <td className="px-4 py-5 text-sm text-slate-600">
                        {formatDate(news.published_at)}
                      </td>

                      <td className="px-4 py-5 text-sm text-slate-600">
                        {news.reading_time
                          ? `${news.reading_time} phút`
                          : "—"}
                      </td>

                      <td className="px-4 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleFeatured(news)
                          }
                          className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-bold transition ${
                            news.is_featured
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-500 hover:bg-amber-50"
                          }`}
                        >
                          <Star
                            className="mr-2"
                            size={15}
                            fill={
                              news.is_featured
                                ? "currentColor"
                                : "none"
                            }
                          />

                          {news.is_featured
                            ? "Nổi bật"
                            : "Không"}
                        </button>
                      </td>

                      <td className="px-4 py-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(news)
                          }
                          className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-bold ${
                            news.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {news.status === "published" ? (
                            <>
                              <Eye className="mr-2" size={15} />
                              Đã đăng
                            </>
                          ) : (
                            <>
                              <EyeOff
                                className="mr-2"
                                size={15}
                              />
                              Bản nháp
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(news)}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-primary-500 transition hover:bg-blue-50"
                            aria-label="Sửa bài viết"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === news.id}
                            onClick={() => handleDelete(news)}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                            aria-label="Xóa bài viết"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {editingId
                    ? "Sửa bài viết"
                    : "Thêm bài viết"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Nhập nội dung bài viết bên dưới.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700">
                  Ảnh thumbnail
                </label>

                <div className="mt-2 rounded-2xl border border-dashed border-slate-300 p-4">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:font-bold file:text-primary-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Chấp nhận JPG, PNG hoặc WebP. Dung lượng tối
                    đa 5MB.
                  </p>

                  {imagePreview && (
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={imagePreview}
                        alt="Xem trước thumbnail"
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <label className="block text-sm font-bold text-slate-700">
                Tiêu đề bài viết *

                <input
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Giá vật liệu xây dựng mới nhất"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Slug

                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="gia-vat-lieu-xay-dung-moi-nhat"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Danh mục

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Kinh nghiệm xây dựng"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Mô tả ngắn *

                <textarea
                  required
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Mô tả ngắn hiển thị tại danh sách bài viết..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <label className="block text-sm font-bold text-slate-700">
                Nội dung bài viết *

                <textarea
                  required
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  placeholder="Nhập nội dung chi tiết của bài viết..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  Thời gian đọc

                  <input
                    name="reading_time"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.reading_time}
                    onChange={handleChange}
                    placeholder="5"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Thứ tự hiển thị

                  <input
                    name="display_order"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.display_order}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700">
                  Ngày đăng

                  <input
                    name="published_at"
                    type="datetime-local"
                    value={formData.published_at}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-primary-500"
                  />
                </label>

                <label className="block text-sm font-bold text-slate-700">
                  Trạng thái

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal outline-none focus:border-primary-500"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">
                      Đã xuất bản
                    </option>
                  </select>
                </label>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />

                Bài viết nổi bật
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
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
                      : "Thêm bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}