import { MAX_IMAGE_SIZE } from "../constants/product";

export function validateImageFile(file) {
  if (!file) {
    return {
      valid: false,
      message: "Chưa chọn hình ảnh.",
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      message: `"${file.name}" không phải file hình ảnh.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      message: `"${file.name}" vượt quá dung lượng 5MB.`,
    };
  }

  return {
    valid: true,
    message: "",
  };
}

export function validateImageFiles(files) {
  for (const file of files) {
    const result = validateImageFile(file);

    if (!result.valid) {
      return result;
    }
  }

  return {
    valid: true,
    message: "",
  };
}