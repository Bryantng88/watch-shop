# PhotoRoom + Sharp local handoff

## Mục tiêu

Luồng Cover hiện dùng PhotoRoom Basic để tách nền, sau đó dùng Sharp để:

- đặt đồng hồ vào giữa canvas storefront `2048x3840`;
- giữ padding đồng đều;
- tạo shadow nhẹ, lệch sang phải;
- xuất PNG nền trắng để preview và xác nhận Cover.

Không chạy lại Sharp trên ảnh đã ép nền trắng hoặc đã có shadow. Luồng PhotoRoom Basic lưu thêm một PNG cutout trong suốt; nút **Tạo lại bằng Sharp** phải dùng cutout này để tránh chồng bóng.

## Cấu hình máy mới

Tạo hoặc cập nhật `.env.local` (file này bị Git ignore):

```env
PHOTOROOM_API_KEY=
PHOTOROOM_PROCESSING_MODE=basic-sharp
PHOTOROOM_SHARP_SHADOW_PROFILE=light
```

Lấy `PHOTOROOM_API_KEY` từ PhotoRoom Dashboard hoặc password manager. Không gửi key qua Git, không ghi key thật vào doc hay file `*.example`.

Profile `light` là cấu hình đang thử nghiệm. Có thể tạm quay lại shadow cũ bằng:

```env
PHOTOROOM_SHARP_SHADOW_PROFILE=legacy
```

Khởi động lại app sau khi đổi biến môi trường.

## Cách test

1. Chọn một ảnh Cover nguồn.
2. Bấm **Xử lý bằng PhotoRoom** một lần để tạo cutout và ảnh hoàn chỉnh (có tính quota).
3. Bấm **Tạo lại bằng Sharp** để tinh chỉnh/kiểm tra shadow mà không gọi PhotoRoom.
4. Mở preview kích thước lớn.
5. Chỉ bấm **Xác nhận Cover** khi ảnh đạt yêu cầu.

Ảnh pending không thay Cover hiện tại. Nếu kết quả lỗi, không xác nhận và refresh trang.

## Trạng thái hiện tại

- Shadow mong muốn: mềm, nhạt và chỉ lệch sang phải; không có halo tối quanh vật thể.
- `light` và `legacy` đều được giữ trong code.
- PhotoRoom trả lỗi HTTP `402` khi tài khoản hết quota; đây không phải lỗi Sharp hay database.
- Ảnh PhotoRoom cũ không có cutout đã lưu sẽ không thể tạo lại bằng Sharp một cách an toàn.

Phần triển khai chính nằm tại:

- `src/domains/watch/application/process-watch-cover-with-photoroom.application.ts`
- `src/app/api/admin/watches/[id]/storefront-image/photoroom/route.ts`
- `src/app/api/admin/watches/[id]/storefront-image/sharp/route.ts`
- `src/domains/watch/ui/edit/WatchImageSection.tsx`
