import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProjects();
  }, []);

  async function loadFeaturedProjects() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order", {
          ascending: true,
        });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto text-center">
          Đang tải dự án...
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto text-center">
          Chưa có dự án tiêu biểu.
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto">

        <div className="mb-12 text-center">

          <p className="text-primary-600 font-semibold uppercase tracking-widest">
            DỰ ÁN TIÊU BIỂU
          </p>

          <h2 className="mt-4 text-5xl font-bold">
            Bằng chứng năng lực qua từng công trình
          </h2>

          <p className="mt-4 text-gray-600">
            Một số công trình dân dụng và công nghiệp đã được An Trinh đồng hành.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {projects.map((project) => (

            <article
              key={project.id}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm"
            >

              <img
                src={project.thumbnail}
                alt={project.title}
                className="h-72 w-full object-cover"
              />

              <div className="space-y-4 p-6">

                <h3 className="text-2xl font-bold">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2 text-gray-500">

                  <MapPin size={18} />

                  {project.location}

                </div>

                <p>

                  {Array.isArray(project.materials)
                    ? project.materials.join(" • ")
                    : ""}

                </p>

                <Link
                  to={`/du-an/${project.slug}`}
                  className="font-semibold text-primary-600"
                >
                  Xem chi tiết →
                </Link>

              </div>

            </article>

          ))}

        </div>

      </div>
    </section>
  );
}