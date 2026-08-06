import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function ProjectDetailPage() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
function ProjectInfo({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <p className="text-sm font-semibold text-slate-500">{label}</p>

      <p className="mt-1 font-bold text-slate-900">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
}
  useEffect(() => {
    async function loadProject() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .single();

        if (error) {
          throw error;
        }

        setProject(data);
      } catch (error) {
        console.error("Lỗi tải chi tiết dự án:", error);
        setErrorMessage("Không tìm thấy dự án.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        Đang tải dự án...
      </div>
    );
  }

  if (errorMessage || !project) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-extrabold">
          Không tìm thấy dự án
        </h1>

        <Link
          to="/du-an"
          className="mt-6 inline-block rounded-xl bg-primary-500 px-5 py-3 font-bold text-white"
        >
          Về danh sách dự án
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-slate-50">
  <section className="bg-primary-600 py-14 text-white">
    <div className="container-custom">
      <Link
        to="/du-an"
        className="text-sm font-bold text-blue-100 hover:text-white"
      >
        ← Quay lại danh sách dự án
      </Link>

      <div className="mt-8 max-w-4xl">
        <div className="flex flex-wrap gap-3">
          {project.project_type && (
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              {project.project_type}
            </span>
          )}

          {project.status && (
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              {project.status}
            </span>
          )}
        </div>

        <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
          {project.title}
        </h1>

        <div className="mt-6 flex flex-wrap gap-6 text-blue-100">
          {project.location && (
            <div className="flex items-center gap-2">
              <MapPin size={19} />
              <span>{project.location}</span>
            </div>
          )}

          {project.completed_date && (
            <div className="flex items-center gap-2">
              <CalendarDays size={19} />
              <span>
                {new Date(
                  project.completed_date
                ).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </section>

  <section className="section-space">
    <div className="container-custom">
      <div className="grid gap-8 lg:grid-cols-[1.6fr_0.7fr]">
        <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="h-[320px] w-full object-cover md:h-[520px]"
            />
          ) : (
            <div className="grid h-[320px] place-items-center bg-slate-100 text-slate-400 md:h-[520px]">
              Chưa có ảnh dự án
            </div>
          )}

          <div className="p-7 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-600">
              Thông tin công trình
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Tổng quan dự án
            </h2>

            <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-700">
              {project.description || "Chưa có mô tả dự án."}
            </p>
          </div>
        </article>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-900">
              Thông tin dự án
            </h2>

            <div className="mt-6 space-y-5">
              <ProjectInfo
                label="Địa điểm"
                value={project.location}
              />

              <ProjectInfo
                label="Loại công trình"
                value={project.project_type}
              />

              <ProjectInfo
                label="Trạng thái"
                value={project.status}
              />

              <ProjectInfo
                label="Ngày hoàn thành"
                value={
                  project.completed_date
                    ? new Date(
                        project.completed_date
                      ).toLocaleDateString("vi-VN")
                    : null
                }
              />
            </div>
          </div>

          {project.materials?.length > 0 && (
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900">
                Vật liệu đã cung cấp
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.materials.map((material) => (
                  <span
                    key={material}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-primary-700"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl bg-slate-900 p-7 text-white">
            <h2 className="text-2xl font-extrabold">
              Cần cung cấp vật liệu?
            </h2>

            <p className="mt-3 leading-7 text-slate-300">
              Liên hệ An Trinh để nhận tư vấn vật liệu và phương án
              vận chuyển phù hợp.
            </p>

            <Link
              to="/#bao-gia"
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-bold text-slate-900"
            >
              Nhận báo giá
            </Link>
          </div>
        </aside>
      </div>
    </div>
  </section>
</main>

  );
}