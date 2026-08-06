export function formatPrice(value, fallback = "Liên hệ") {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return `${new Intl.NumberFormat("vi-VN").format(
    numberValue,
  )}đ`;
}

export function formatDate(
  value,
  fallback = "Chưa cập nhật",
) {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Ngày không hợp lệ";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}