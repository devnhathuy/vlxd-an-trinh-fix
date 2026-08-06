import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getPublishedNews } from "../services/newsService";

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

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getPublishedNews();

      setNewsList(data);
    } catch (error) {
      console.error("Lỗi tải tin tức:", error);

      setErrorMessage(
        `Không thể tải danh sách bài viết: ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredNews = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return newsList;

    return newsList.filter((news) => {
      return (
        news.title?.toLowerCase().includes(keyword) ||
        news.summary?.toLowerCase().includes(keyword) ||
        news.category?.toLowerCase().includes(keyword)
      );
    });
  }, [newsList, searchTerm]);

  const featuredNews = filteredNews.find(
    (news) => news.is_featured,
  );

  const remainingNews = featuredNews
    ? filteredNews.filter((news) => news.id !== featuredNews.id)
    : filteredNews;

  return (
    <main className="bg-slate-50">
      <section className="bg-primary-600 py-16 text-white md:py-20">
        <div className="container-custom">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-blue-100">
            Tin tức và kiến thức
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Thông tin hữu ích cho người xây dựng
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-blue-100">
            Cập nhật thị trường vật liệu, kinh nghiệm lựa chọn
            sản phẩm và kiến thức thi công thực tế.
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-custom">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">
                Bài viết mới nhất
              </h2>

              <p className="mt-2 text-slate-500">
                Tổng cộng {newsList.length} bài viết đã xuất bản.
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
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-primary-500 md:w-80"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-xl bg-rose-50 p-4 font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl bg-white py-20 text-center font-semibold text-slate-500">
              Đang tải tin tức...
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="rounded-3xl bg-white py-20 text-center text-slate-500 shadow-sm">
              Chưa có bài viết phù hợp.
            </div>
          ) : (
            <>
              {featuredNews && (
                <article className="mb-8 grid overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-2">
                  <Link
                    to={`/tin-tuc/${featuredNews.slug}`}
                    className="block min-h-80 overflow-hidden bg-slate-100"
                  >
                    {featuredNews.thumbnail ? (
                      <img
                        src={featuredNews.thumbnail}
                        alt={featuredNews.title}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full min-h-80 place-items-center font-bold text-slate-400">
                        Chưa có ảnh
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-col justify-center p-7 md:p-10">
                    <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold uppercase text-amber-700">
                      Bài viết nổi bật
                    </span>

                    <p className="mt-5 text-sm font-bold uppercase tracking-wider text-primary-500">
                      {featuredNews.category || "Tin tức"}
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
                      <Link
                        to={`/tin-tuc/${featuredNews.slug}`}
                        className="transition hover:text-primary-500"
                      >
                        {featuredNews.title}
                      </Link>
                    </h2>

                    <p className="mt-4 line-clamp-3 leading-7 text-slate-600">
                      {featuredNews.summary}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
                      <span className="inline-flex items-center">
                        <CalendarDays className="mr-2" size={17} />
                        {formatDate(featuredNews.published_at)}
                      </span>

                      <span className="inline-flex items-center">
                        <Clock3 className="mr-2" size={17} />
                        {featuredNews.reading_time || 1} phút đọc
                      </span>
                    </div>

                    <Link
                      to={`/tin-tuc/${featuredNews.slug}`}
                      className="mt-7 inline-flex items-center font-extrabold text-primary-500"
                    >
                      Đọc bài viết
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </div>
                </article>
              )}

              {remainingNews.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {remainingNews.map((news) => (
                    <article
                      key={news.id}
                      className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Link
                        to={`/tin-tuc/${news.slug}`}
                        className="block h-56 overflow-hidden bg-slate-100"
                      >
                        {news.thumbnail ? (
                          <img
                            src={news.thumbnail}
                            alt={news.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full place-items-center font-bold text-slate-400">
                            Chưa có ảnh
                          </div>
                        )}
                      </Link>

                      <div className="p-6">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-primary-500">
                          {news.category || "Tin tức"}
                        </p>

                        <h3 className="mt-3 min-h-14 text-xl font-extrabold text-slate-900">
                          <Link
                            to={`/tin-tuc/${news.slug}`}
                            className="transition hover:text-primary-500"
                          >
                            {news.title}
                          </Link>
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {news.summary}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="inline-flex items-center">
                            <CalendarDays
                              className="mr-1.5"
                              size={15}
                            />
                            {formatDate(news.published_at)}
                          </span>

                          <span className="inline-flex items-center">
                            <Clock3 className="mr-1.5" size={15} />
                            {news.reading_time || 1} phút
                          </span>
                        </div>

                        <Link
                          to={`/tin-tuc/${news.slug}`}
                          className="mt-5 inline-flex items-center font-extrabold text-primary-500"
                        >
                          Đọc tiếp
                          <ArrowRight className="ml-2" size={17} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}