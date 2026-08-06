import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";

import { formatPrice } from "../../utils/formatters";

export default function ProductTable({
  products,
  deletingId,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-[900px] w-full">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
            <th className="px-4 py-4">Sản phẩm</th>
            <th className="px-4 py-4">Đơn vị</th>
            <th className="px-4 py-4">Giá</th>
            <th className="px-4 py-4">Kho hàng</th>
            <th className="px-4 py-4">Nổi bật</th>
            <th className="px-4 py-4">Hiển thị</th>
            <th className="px-4 py-4 text-right">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-slate-100 hover:bg-slate-50"
            >
              <td className="px-4 py-5">
                <div className="flex min-w-72 items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-xs font-bold text-slate-400">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      /{product.slug}
                    </p>

                    {product.badge && (
                      <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase text-amber-700">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-5 text-sm text-slate-600">
                {product.unit || "—"}
              </td>

              <td className="px-4 py-5">
                <p className="font-extrabold text-primary-500">
                  {formatPrice(product.price)}
                </p>

                {product.price_note && (
                  <p className="mt-1 text-xs text-slate-500">
                    {product.price_note}
                  </p>
                )}
              </td>

              <td className="px-4 py-5 text-sm font-semibold text-slate-700">
                {product.stock_status || "—"}
              </td>

              <td className="px-4 py-5">
                {product.is_featured ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    Nổi bật
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">
                    Không
                  </span>
                )}
              </td>

              <td className="px-4 py-5">
                <button
                  type="button"
                  onClick={() => onToggleActive(product)}
                  className={`inline-flex items-center rounded-full px-3 py-2 text-xs font-bold ${
                    product.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {product.is_active ? (
                    <>
                      <Eye className="mr-2" size={15} />
                      Đang hiện
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-2" size={15} />
                      Đang ẩn
                    </>
                  )}
                </button>
              </td>

              <td className="px-4 py-5">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-primary-500 transition hover:bg-blue-50"
                    aria-label="Sửa sản phẩm"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === product.id}
                    onClick={() => onDelete(product)}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                    aria-label="Xóa sản phẩm"
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
  );
}