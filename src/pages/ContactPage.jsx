import { useEffect, useState } from "react";
import { Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { getSiteSettings } from "../services/siteSettingsService";

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Không thể tải thông tin liên hệ.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        Đang tải thông tin liên hệ...
      </div>
    );
  }

  const phone = settings?.phone || "0909 264 264";
  const email = settings?.email || "vlxd.antrinh1@gmail.com";
  const address = settings?.address || "Đức Hòa, Long An";
  const workingTime = settings?.working_time || "07:00 - 17:30";

  const phoneNumber = phone.replace(/\s/g, "");
  const zaloNumber = settings?.zalo?.replace(/\s/g, "");

  return (
    <main className="bg-slate-50">
      <section className="bg-primary-500 py-16 text-white">
        <div className="container-custom text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
            Liên hệ
          </p>

          <h1 className="text-3xl font-extrabold md:text-5xl">
            Kết nối với VLXD An Trinh
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-blue-100">
            Liên hệ để được tư vấn vật liệu, kiểm tra giá và hỗ trợ giao hàng
            nhanh tại Đức Hòa, Long An và khu vực lân cận.
          </p>
        </div>
      </section>

      <section className="section-space">
        <div className="container-custom">
          {errorMessage && (
            <div className="mb-6 rounded-xl bg-rose-50 p-4 text-rose-700">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Thông tin liên hệ */}
            <div className="rounded-3xl bg-white p-7 shadow-sm md:p-10">
              <h2 className="text-2xl font-extrabold text-slate-900">
                Thông tin liên hệ
              </h2>

              <p className="mt-3 text-slate-600">
                Đội ngũ An Trinh sẵn sàng hỗ trợ báo giá, tư vấn vật liệu và
                lịch giao hàng.
              </p>

              <div className="mt-8 space-y-6">
                <ContactItem
                  icon={<Phone size={21} />}
                  label="Hotline"
                  value={phone}
                  href={`tel:${phoneNumber}`}
                />

                <ContactItem
                  icon={<Mail size={21} />}
                  label="Email"
                  value={email}
                  href={`mailto:${email}`}
                />

                <ContactItem
                  icon={<MapPin size={21} />}
                  label="Địa chỉ"
                  value={address}
                />

                <ContactItem
                  icon={<Clock3 size={21} />}
                  label="Giờ làm việc"
                  value={workingTime}
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${phoneNumber}`}
                  className="rounded-xl bg-primary-500 px-5 py-3 font-bold text-white transition hover:bg-primary-600"
                >
                  Gọi ngay
                </a>

                {zaloNumber && (
                  <a
                    href={`https://zalo.me/${zaloNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-primary-500 px-5 py-3 font-bold text-primary-600 transition hover:bg-blue-50"
                  >
                    Nhắn Zalo
                  </a>
                )}
              </div>
            </div>

            {/* Bản đồ */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              {settings?.map_embed_url ? (
                <iframe
                  title="Bản đồ VLXD An Trinh"
                  src={settings.map_embed_url}
                  className="h-[420px] w-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="grid h-[420px] place-items-center bg-slate-100 px-6 text-center">
                  <div>
                    <MapPin
                      size={42}
                      className="mx-auto mb-4 text-primary-500"
                    />

                    <p className="font-bold text-slate-800">
                      Chưa có bản đồ nhúng
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Hãy thêm đường dẫn Google Maps Embed vào
                      site_settings.map_embed_url.
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 p-5">
                <a
                  href="https://maps.app.goo.gl/ugtb3FSBNRDLUJke9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
                >
                  Chỉ đường trên Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Kêu gọi báo giá */}
          <div className="mt-10 rounded-3xl bg-slate-900 p-8 text-white md:flex md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="text-2xl font-extrabold">
                Bạn cần báo giá vật liệu?
              </h2>

              <p className="mt-2 text-slate-300">
                Gửi thông tin để được tư vấn theo số lượng và địa điểm giao
                hàng.
              </p>
            </div>

            <a
              href="/#bao-gia"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-slate-100 md:mt-0"
            >
              <Send size={18} />
              Nhận báo giá
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactItem({ icon, label, value, href }) {
  const content = (
    <div className="flex gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-1 font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a className="block" href={href}>
      {content}
    </a>
  ) : (
    content
  );
}