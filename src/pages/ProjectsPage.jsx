import { useEffect, useState } from "react";
import { MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/projectService";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Lỗi tải dự án:", error);
        setErrorMessage("Không thể tải danh sách dự án.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <main className="bg-slate-50">
      <section className="bg-primary-500 py-16 text-white">
        <div className="container-custom text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
            Công trình tiêu biểu
          </p>

          <h1 className="text-3xl font-extrabold md:text-5xl">
            Dự án của VLXD An Trinh
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-blue-100">
            Những công trình đã được An Trinh cung cấp vật liệu,
            hỗ trợ vận chuyển và đồng hành trong quá trình thi công.
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-custom">
          {errorMessage && (
            <div className="mb-6 rounded-xl bg-rose-50 p-4 font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center font-semibold text-slate-500">
              Đang tải dự án...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900">
                Chưa có dự án
              </h2>

              <p className="mt-3 text-slate-500">
                Các công trình tiêu biểu sẽ được cập nhật tại đây.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-sm text-slate-400">
                        Chưa có ảnh dự án
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {project.title}
                    </h2>

                    {project.location && (
                      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={17} />
                        <span>{project.location}</span>
                      </div>
                    )}

                    {project.completed_date && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={17} />
                        <span>
                          {new Date(
                            project.completed_date
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                      {project.description ||
                        "Dự án được VLXD An Trinh cung cấp vật liệu và hỗ trợ thi công."}
                    </p>

                    <Link
                      to={`/du-an/${project.slug}`}
                      className="mt-6 inline-flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700"
                    >
                      Xem chi tiết
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}