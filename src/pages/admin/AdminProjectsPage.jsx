import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  createProject,
  updateProject,
  getAllProjects,
} from "../../services/projectService";
import { uploadProjectImage } from "../../services/projectImageService";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
const [showModal, setShowModal] = useState(false);
const [editingProject, setEditingProject] = useState(null);

const [formData, setFormData] = useState({
  title: "",
  slug: "",
  location: "",
  project_type: "",
  status: "Hoàn thành",
  description: "",
  completed_date: "",
  display_order: 1,
  is_active: true,
  is_featured: false
});

const [imageFile, setImageFile] = useState(null);
const [saving, setSaving] = useState(false);
  useEffect(() => {
    getAllProjects();
  }, []);

  async function getAllProjects() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi tải dự án:", error);
      setErrorMessage(error.message);
      setProjects([]);
    } else {
      setProjects(data ?? []);
    }

    setLoading(false);
  }

async function toggleProject(project) {
  try {
    const newActiveStatus = !project.is_active;

    const { error } = await supabase
      .from("projects")
      .update({
        is_active: newActiveStatus,
      })
      .eq("id", project.id);

    if (error) {
      throw error;
    }

    setProjects((previousProjects) =>
      previousProjects.map((item) =>
        item.id === project.id
          ? {
              ...item,
              is_active: newActiveStatus,
            }
          : item
      )
    );
  } catch (error) {
    console.error("Lỗi cập nhật hiển thị dự án:", error);

    alert(
      `Không thể ${
        project.is_active ? "ẩn" : "hiện"
      } dự án: ${error.message}`
    );
  }
}
async function toggleFeatured(project) {
  try {
    const newFeaturedStatus = !project.is_featured;

    const { data, error } = await supabase
      .from("projects")
      .update({
        is_featured: newFeaturedStatus,
      })
      .eq("id", project.id)
      .select("id, is_featured")
      .single();

    if (error) throw error;

    setProjects((previousProjects) =>
      previousProjects.map((item) =>
        item.id === project.id
          ? {
              ...item,
              is_featured: data.is_featured,
            }
          : item
      )
    );
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
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

function handleInputChange(event) {
  const { name, value, type, checked } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: type === "checkbox" ? checked : value,
    ...(name === "title"
      ? {
          slug: createSlug(value),
        }
      : {}),
  }));
}

function resetForm() {
  setFormData({
    title: "",
    slug: "",
    location: "",
    project_type: "",
    status: "Hoàn thành",
    description: "",
    completed_date: "",
    display_order: 1,
    is_active: true,
    is_featured: false
  });
setEditingProject(null);
  setImageFile(null);
  setShowModal(false);
}
function startEdit(project) {
  setEditingProject(project);

  setFormData({
    title: project.title ?? "",
    slug: project.slug ?? "",
    location: project.location ?? "",
    project_type: project.project_type ?? "",
    status: project.status ?? "",
    description: project.description ?? "",
    completed_date: project.completed_date ?? "",
    display_order: project.display_order ?? 1,
    is_active: project.is_active,
    is_featured: project.is_featured
  });

  setImageFile(null);

  setShowModal(true);
}
async function handleSubmit(event) {
  event.preventDefault();

  if (!formData.title.trim()) {
    alert("Vui lòng nhập tên dự án.");
    return;
  }

  if (!formData.slug.trim()) {
    alert("Vui lòng nhập slug.");
    return;
  }

  try {
    setSaving(true);

let thumbnailUrl = editingProject?.thumbnail ?? null;

    if (imageFile) {
      thumbnailUrl = await uploadProjectImage(imageFile);
    }

const payload = {
  ...formData,
  title: formData.title.trim(),
  slug: formData.slug.trim(),
  location: formData.location.trim() || null,
  project_type: formData.project_type.trim() || null,
  description: formData.description.trim() || null,
  completed_date: formData.completed_date || null,
  display_order: Number(formData.display_order) || 1,
  thumbnail: thumbnailUrl,
  is_featured: formData.is_featured,
};

if (editingProject) {
  await updateProject(editingProject.id, payload);
} else {
  await createProject(payload);
}

    await loadProjects();
    resetForm();

    alert(
  editingProject
    ? "Cập nhật dự án thành công."
    : "Thêm dự án thành công."
);
  } catch (error) {
    console.error("Lỗi thêm dự án:", error);
    alert(`Không thể thêm dự án: ${error.message}`);
  } finally {
    setSaving(false);
  }
}
  return (
      <>
    {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
  {editingProject ? "Chỉnh sửa dự án" : "Thêm dự án"}
</h2>

          <p className="mt-1 text-sm text-slate-500">
            Nhập thông tin công trình để hiển thị trên website.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 font-bold text-slate-600"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block font-bold text-slate-700">
              Tên dự án *
            </span>

            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
              placeholder="Ví dụ: Cung cấp vật liệu nhà phố Đức Hòa"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block font-bold text-slate-700">
              Slug *
            </span>

            <input
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
              placeholder="cung-cap-vat-lieu-nha-pho-duc-hoa"
            />
          </label>

          <label>
            <span className="mb-2 block font-bold text-slate-700">
              Địa điểm
            </span>

            <input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
              placeholder="Đức Hòa, Long An"
            />
          </label>

          <label>
            <span className="mb-2 block font-bold text-slate-700">
              Loại công trình
            </span>

            <input
              name="project_type"
              value={formData.project_type}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
              placeholder="Nhà phố, nhà xưởng..."
            />
          </label>

          <label>
            <span className="mb-2 block font-bold text-slate-700">
              Trạng thái
            </span>

            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
            >
              <option value="Đang thi công">Đang thi công</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block font-bold text-slate-700">
              Ngày hoàn thành
            </span>

            <input
              type="date"
              name="completed_date"
              value={formData.completed_date}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
            />
          </label>

          <label>
            <span className="mb-2 block font-bold text-slate-700">
              Thứ tự hiển thị
            </span>

            <input
              type="number"
              min="1"
              name="display_order"
              value={formData.display_order}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
            />
          </label>

          <label>
            <span className="mb-2 block font-bold text-slate-700">
              Ảnh đại diện
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] ?? null)
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block font-bold text-slate-700">
              Mô tả
            </span>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary-500"
              placeholder="Mô tả vật liệu cung cấp và quy mô công trình..."
            />
          </label>

          <label className="flex items-center gap-3 md:col-span-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-5 w-5"
            />

            <span className="font-bold text-slate-700">
              Hiển thị dự án trên website
            </span>
            <label className="flex items-center gap-3 md:col-span-2">
  <input
    type="checkbox"
    name="is_featured"
    checked={formData.is_featured}
    onChange={handleInputChange}
    className="h-5 w-5"
  />

  <span className="font-bold text-slate-700">
    Dự án tiêu biểu
  </span>
</label>
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={resetForm}
            disabled={saving}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
          >
            Hủy
          </button>

          <button
  type="submit"
  disabled={saving}
  className="rounded-xl bg-primary-500 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
>
  {saving
    ? "Đang lưu..."
    : editingProject
    ? "Cập nhật dự án"
    : "Lưu dự án"}
</button>
        </div>
      </form>
    </div>
  </div>
)}
    <main className="min-h-screen bg-slate-100 px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Quản lý dự án
            </h1>

            <p className="mt-2 text-slate-500">
              Thêm, chỉnh sửa và quản lý các công trình tiêu biểu.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700"
            >
              Về Dashboard
            </Link>

            <button
  type="button"
  onClick={() => {
    setEditingProject(null);
    setShowModal(true);
  }}
  className="rounded-xl bg-primary-500 px-5 py-3 font-bold text-white"
    >
  Thêm dự án
    </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl bg-rose-50 p-4 text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              Đang tải dự án...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              Chưa có dự án.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-left text-sm text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Dự án</th>
                    <th className="px-6 py-4">Địa điểm</th>
                    <th className="px-6 py-4">Loại</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Hiển thị</th>
                    <th className="px-6 py-4">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900">
                          {project.title}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          /{project.slug}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {project.location || "—"}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {project.project_type || "—"}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {project.status || "Chưa cập nhật"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            project.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {project.is_active ? "Đang hiện" : "Đang ẩn"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-4">

  <button
    type="button"
    onClick={() => startEdit(project)}
    className="font-bold text-blue-600"
  >
    Sửa
  </button>
<button
  type="button"
  onClick={() => toggleFeatured(project)}
  className={`font-bold ${
    project.is_featured
      ? "text-amber-600"
      : "text-gray-500"
  }`}
>
  {project.is_featured ? "Bỏ tiêu biểu" : "Tiêu biểu"}
</button>
  <button
    type="button"
    onClick={() => toggleProject(project)}
    className="font-bold text-primary-600"
  >
    {project.is_active ? "Ẩn" : "Hiện"}
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
      </div>
    </main>
 </>
  );
}