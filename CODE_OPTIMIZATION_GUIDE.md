# Hướng tối ưu code VLXD An Trình

## Các lỗi đã sửa

1. Xóa code React bị dán nhầm vào `src/services/adminProductService.js`.
2. Xóa hai khai báo trùng tên `saveProduct` gây lỗi cú pháp.
3. Viết lại `AdminProductsPage.jsx`; bổ sung đúng `handleSubmit`.
4. Bổ sung import `createSlug` và gom thao tác thêm/sửa qua `saveAdminProduct`.
5. Sửa upload ảnh đại diện và gallery, validate file, xóa preview URL khi không dùng.
6. Chặn thêm trùng ID ảnh vào danh sách chờ xóa.
7. Chuẩn hóa lại component nhập ảnh và gallery.

## Nguyên tắc cấu trúc nên giữ

- `pages/`: ghép giao diện và điều phối use case, không viết câu lệnh Supabase trực tiếp.
- `components/`: component hiển thị, nhận dữ liệu và callback qua props.
- `hooks/`: state và hành vi tái sử dụng của form hoặc màn hình.
- `services/`: chỉ truy cập Supabase/API, không sử dụng state React, DOM hoặc event.
- `utils/`: hàm thuần như format, validate, tạo slug.
- `constants/`: giá trị cố định, trạng thái, form mặc định.

## Cách thêm chức năng mới

Ví dụ thêm chức năng "nhân bản sản phẩm":

1. Thêm `duplicateAdminProduct(productId)` trong `adminProductService.js`.
2. Thêm nút và prop `onDuplicate` trong `ProductTable.jsx`.
3. Thêm `handleDuplicate` trong `AdminProductsPage.jsx`.
4. Không dán code xử lý state hoặc event vào service.

## Hướng tối ưu tiếp theo

1. Tách toàn bộ logic CRUD của `AdminProductsPage` sang hook `useAdminProducts`.
2. Tạo `productMapper.js` gồm `productToForm()` và `formToProductPayload()`.
3. Tạo service chung upload/xóa file Storage, lưu cả `image_path` để xóa file thật khi xóa ảnh.
4. Thêm ESLint + Prettier để phát hiện biến chưa khai báo, duplicate function và code sai format.
5. Thêm test cho `createSlug`, validate ảnh và mapper payload.
6. Chia ProductForm thành các nhóm nhỏ: BasicInfo, Pricing, Inventory, Images, Visibility.
