import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("quotation_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Lỗi tải báo giá:", error);

      setMessage({
        type: "error",
        text: `Không thể tải yêu cầu báo giá: ${error.message}`,
      });

      setLoading(false);
      return;
    }

    setQuotes(data ?? []);
    setLoading(false);
  }
async function updateQuoteStatus(id, status) {
  const { error } = await supabase
    .from("quotation_requests")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Lỗi cập nhật trạng thái:", error);

    setMessage({
      type: "error",
      text: `Không thể cập nhật trạng thái: ${error.message}`,
    });

    return;
  }

  setQuotes((currentQuotes) =>
    currentQuotes.map((quote) =>
      quote.id === id
        ? { ...quote, status }
        : quote
    )
  );

  setMessage({
    type: "success",
    text: "Đã cập nhật trạng thái báo giá.",
  });
}
  function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function formatMaterials(materials) {
    if (!materials) return "—";

    if (Array.isArray(materials)) {
      return materials.join(", ");
    }

    return String(materials);
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">
          Đang tải yêu cầu báo giá...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Quản lý báo giá
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Tổng số yêu cầu: {quotes.length}
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
                <th className="px-4 py-3 font-bold">
  Chi tiết
</th>
              <th className="px-4 py-3 font-bold">
                Khách hàng
              </th>

              <th className="px-4 py-3 font-bold">
                Số điện thoại
              </th>

              <th className="px-4 py-3 font-bold">
                Vật liệu
              </th>

              <th className="px-4 py-3 font-bold">
                Địa chỉ
              </th>

              <th className="px-4 py-3 font-bold">
                Trạng thái
              </th>

              <th className="px-4 py-3 font-bold">
                Ngày gửi
              </th>
            </tr>
          </thead>

          <tbody>
            {quotes.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-10 text-center text-slate-500"
                >
                  Chưa có yêu cầu báo giá.
                </td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {quote.full_name || "—"}
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {quote.phone || "—"}
                  </td>

                  <td className="max-w-xs px-4 py-3 text-slate-700">
                    {formatMaterials(quote.materials)}
                  </td>

                  <td className="max-w-xs px-4 py-3 text-slate-700">
                    {quote.delivery_address || "—"}
                  </td>

                 <td className="px-4 py-3">
  <select
    value={quote.status || "Mới tiếp nhận"}
    onChange={(event) =>
      updateQuoteStatus(
        quote.id,
        event.target.value
      )
    }
    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-primary-500"
  >
    <option value="Mới tiếp nhận">
      Mới tiếp nhận
    </option>

    <option value="Đang xử lý">
      Đang xử lý
    </option>

    <option value="Đã báo giá">
      Đã báo giá
    </option>

    <option value="Hoàn thành">
      Hoàn thành
    </option>

    <option value="Đã hủy">
      Đã hủy
    </option>
  </select>
</td>

                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {formatDate(quote.created_at)}
                  </td>
                  <td className="px-4 py-3">
  <button
    type="button"
    onClick={() => setSelectedQuote(quote)}
    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
  >
    Xem
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedQuote && (
  <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Chi tiết yêu cầu báo giá
        </h2>

        <button
          onClick={() => setSelectedQuote(null)}
          className="text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4 text-sm">

        <p>
          <strong>Khách hàng:</strong>{" "}
          {selectedQuote.full_name}
        </p>

        <p>
          <strong>Điện thoại:</strong>{" "}
          {selectedQuote.phone}
        </p>

        <p>
          <strong>Địa chỉ:</strong>{" "}
          {selectedQuote.delivery_address || "—"}
        </p>

        <p>
          <strong>Vật liệu:</strong>{" "}
          {Array.isArray(selectedQuote.materials)
            ? selectedQuote.materials.join(", ")
            : selectedQuote.materials}
        </p>

        <p>
          <strong>Số lượng:</strong>{" "}
          {selectedQuote.estimated_quantity || "—"}
        </p>

        <p>
          <strong>Ghi chú:</strong>{" "}
          {selectedQuote.note || "Không có"}
        </p>

      </div>

    </div>
  </div>
)}
    </div>
  );
}