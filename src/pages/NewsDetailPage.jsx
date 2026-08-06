import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Newspaper,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getPublishedNewsBySlug } from "../services/newsService";

function formatDate(value) {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function NewsDetailPage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadArticle();
  }, [slug]);

  async function loadArticle() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getPublishedNewsBySlug(slug);

      if (!data) {
        setErrorMessage("Không tìm thấy bài viết.");
        setArticle(null);
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);

      setErrorMessage(
        `Không thể tải bài viết: ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-slate-50">
        <div className="container-custom py-24 text-center font-semibold text-slate-500">
          Đang tải bài viết...
        </div>
      </main>
    );
  }

  if (errorMessage || !article) {
    return (
      <main className="min-h-[60vh] bg-slate-50">
        <div className="container-custom py-24 text-center">
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 shadow-sm">
            <Newspaper
              className="mx-auto text-slate-300"
              size={48}
            />

            <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
              Không tìm thấy bài viết
            </h1>

            <p className="mt-3 text-slate-500">
              {errorMessage ||
                "Bài viết không tồn tại hoặc chưa được xuất bản."}
            </p>

            <Link
              to="/tin-tuc"
              className="mt-7 inline-flex items-center rounded-xl bg-primary-500 px-5 py-3 font-bold text-white"
            >
              <ArrowLeft className="mr-2" size={18} />
              Quay lại tin tức
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-custom py-10 md:py-14">
          <Link
            to="/tin-tuc"
            className="inline-flex items-center font-bold text-primary-500"
          >
            <ArrowLeft className="mr-2" size={18} />
            Quay lại danh sách tin tức
          </Link>

          <div className="mt-8 max-w-4xl">
            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold uppercase text-primary-600">
              {article.category || "Tin tức"}
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              {article.title}
            </h1>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
              <span className="inline-flex items-center">
                <CalendarDays className="mr-2" size={17} />
                {formatDate(article.published_at)}
              </span>

              <span className="inline-flex items-center">
                <Clock3 className="mr-2" size={17} />
                {article.reading_time || 1} phút đọc
              </span>
            </div>

            {article.summary && (
              <p className="mt-7 text-lg leading-8 text-slate-600">
                {article.summary}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="container-custom">
          <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-white shadow-sm">
            {article.thumbnail && (
              <img
                src={article.thumbnail}
                alt={article.title}
                className="max-h-[560px] w-full object-cover"
              />
            )}

            <div className="p-6 md:p-10">
              <div className="whitespace-pre-line text-base leading-8 text-slate-700 md:text-lg">
                {article.content}
              </div>

              <div className="mt-10 border-t border-slate-200 pt-7">
                <Link
                  to="/tin-tuc"
                  className="inline-flex items-center font-extrabold text-primary-500"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Xem các bài viết khác
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}