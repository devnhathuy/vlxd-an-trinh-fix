import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getPublishedNews } from "../../services/newsService";
import SectionHeading from "../ui/SectionHeading";

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

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getPublishedNews();

      setNewsList(data ?? []);
    } catch (error) {
      console.error("Không thể tải tin tức trang chủ:", error);

      setErrorMessage("Không thể tải tin tức.");
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  }

  /*
   * Ưu tiên bài nổi bật trước.
   * Nếu chưa đủ 4 bài nổi bật thì lấy thêm bài mới nhất.
   */
  const displayedNews = useMemo(() => {
    const featured = newsList.filter(
      (item) => item.is_featured,
    );

    const normal = newsList.filter(
      (item) => !item.is_featured,
    );

    return [...featured, ...normal].slice(0, 4);
  }, [newsList]);

  const [mainNews, ...sideNews] = displayedNews;

  return (
    <section className="section-space bg-slate-50">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Tin tức & kiến thức"
          title="Thông tin hữu ích cho người xây dựng"
          description="Cập nhật thị trường và chia sẻ kinh nghiệm lựa chọn vật liệu."
        />

        {errorMessage && (
          <div className="rounded-2xl bg-rose-50 p-5 text-center font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white py-16 text-center font-semibold text-slate-500">
            Đang tải tin tức...
          </div>
        ) : !mainNews ? (
          <div className="rounded-2xl bg-white py-16 text-center text-slate-500">
            Chưa có bài viết đã xuất bản.
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="group overflow-hidden rounded-2xl bg-white shadow-sm">
                <Link
                  to={`/tin-tuc/${mainNews.slug}`}
                  className="block overflow-hidden bg-slate-100"
                >
                  {mainNews.thumbnail ? (
                    <img
                      src={mainNews.thumbnail}
                      alt={mainNews.title}
                      className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-80 place-items-center font-bold text-slate-400">
                      Chưa có ảnh
                    </div>
                  )}
                </Link>

                <div className="p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-primary-500">
                      {mainNews.category || "Tin tức"}
                    </span>

                    {mainNews.is_featured && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                        Nổi bật
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-2xl font-extrabold text-slate-900">
                    <Link
                      to={`/tin-tuc/${mainNews.slug}`}
                      className="transition hover:text-primary-500"
                    >
                      {mainNews.title}
                    </Link>
                  </h3>

                  <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                    {mainNews.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center">
                      <CalendarDays className="mr-2" size={16} />
                      {formatDate(mainNews.published_at)}
                    </span>

                    <span className="inline-flex items-center">
                      <Clock3 className="mr-2" size={16} />
                      {mainNews.reading_time || 1} phút đọc
                    </span>
                  </div>

                  <Link
                    to={`/tin-tuc/${mainNews.slug}`}
                    className="mt-5 inline-flex items-center gap-2 font-bold text-primary-500"
                  >
                    Đọc bài viết
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>

              <div className="grid gap-5">
                {sideNews.map((item) => (
                  <article
                    key={item.id}
                    className="grid overflow-hidden rounded-2xl bg-white shadow-sm sm:grid-cols-[180px_1fr]"
                  >
                    <Link
                      to={`/tin-tuc/${item.slug}`}
                      className="block overflow-hidden bg-slate-100"
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-52 w-full object-cover transition duration-500 hover:scale-105 sm:h-full"
                        />
                      ) : (
                        <div className="grid h-52 place-items-center text-sm font-bold text-slate-400 sm:h-full">
                          Chưa có ảnh
                        </div>
                      )}
                    </Link>

                    <div className="p-5">
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-bold uppercase text-primary-500">
                          {item.category || "Tin tức"}
                        </span>

                        {item.is_featured && (
                          <span className="text-xs font-bold text-amber-600">
                            Nổi bật
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 line-clamp-2 text-lg font-extrabold text-slate-900">
                        <Link
                          to={`/tin-tuc/${item.slug}`}
                          className="transition hover:text-primary-500"
                        >
                          {item.title}
                        </Link>
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                        {item.summary}
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        {formatDate(item.published_at)} •{" "}
                        {item.reading_time || 1} phút đọc
                      </p>

                      <Link
                        to={`/tin-tuc/${item.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-500"
                      >
                        Đọc thêm
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/tin-tuc"
                className="inline-flex items-center rounded-xl border border-primary-500 px-6 py-3 font-bold text-primary-500 transition hover:bg-primary-500 hover:text-white"
              >
                Xem tất cả tin tức
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}