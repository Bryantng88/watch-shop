# Ký gửi và xem nhanh đồng hồ

## Hồ sơ và tiền

Mua bán → Ký gửi có hai hướng: nhận từ người gửi, hoặc gửi đồng hồ shop sở hữu cho đối tác. Dùng Acquisition loại CONSIGNMENT, một AcquisitionItem và JSON `consignment` phiên bản 1; dùng Payment ACQUISITION hiện có, không thêm sổ tiền riêng.

Thỏa thuận chọn trên mỗi hồ sơ, không mặc định phí bằng 0:

- Phần trăm giá bán: phí = làm tròn giá bán × tỷ lệ / 100.
- Phí cố định: phí là số VND đã thỏa thuận.
- Chốt tiền chủ đồng hồ nhận: phần còn lại là phí bên bán hưởng.

Nhận ký gửi: shop hưởng phí, phần còn lại trả người gửi. Gửi đối tác: đối tác hưởng phí, phần còn lại shop nhận. VND nguyên; phí hoặc tiền chủ đồng hồ nhận không được lớn hơn giá bán. Chỉ sửa thỏa thuận trước chốt bán.

| Trạng thái | Hành vi |
| --- | --- |
| Nháp | Chưa nhập/xuất kho. Watch nhận mới chưa bán/xuất bản được. Có thể hủy. |
| Đang ký gửi | Nhận: mở vòng tồn kho, giữ sở hữu CONSIGNED_FROM. Gửi: lưu trạng thái cũ, chuyển CONSIGNED_TO và ra khỏi kho; phải hoàn tất kỹ thuật trước. |
| Trả / nhận lại | Chưa bán/giữ cho đơn. Trả chủ đóng vòng tồn kho, ngừng xuất bản. Nhận về từ đối tác khôi phục trạng thái trước khi gửi. |
| Đã bán, chờ quyết toán | Nhận ký gửi chọn đơn đã bán chứa đúng watch. Gửi đối tác nhập giá và tham chiếu báo bán. Chốt tiền phải thu/chi, chưa tự ghi tiền. |
| Đã quyết toán | Chỉ khóa khi thu/chi đủ và không còn khoản chưa hoàn tất. Khóa thỏa thuận và thanh toán. |

PaymentWorkspace dùng owner ACQUISITION: nhận ký gửi chi OUT, gửi đối tác thu IN. Phí đối tác giữ từ giá bán được tính vào chi phí; giá vốn mua gốc không bị dòng ký gửi 0 đồng ghi đè. Watch nhận ký gửi dùng tiền trả chủ làm giá vốn dự kiến, sau chốt bán dùng số đã chốt.

## Nhất quán và quyền

Tái sử dụng quyền Acquisition. Quản lý điều khoản cần đọc tài chính (PRODUCT_COST_VIEW và quyền xem thanh toán Acquisition, hoặc ADMIN). Người chỉ xem hồ sơ nhận các giá trị tiền đã che. Không mở thêm quyền preview.

Khóa Product rồi Acquisition khi chuyển trạng thái; unique index chặn nhiều hồ sơ đang xử lý cho một watch. UUID receipt/checksum chống tạo trùng khi thử lại; cập nhật cần đúng phiên bản updatedAt. Payment khóa cùng Acquisition để tránh đua với khóa quyết toán. Sự kiện/projection hiện có cập nhật danh sách và giá vốn. Rebuild ngay thất bại sẽ báo chờ đồng bộ thay vì yêu cầu tạo lại hồ sơ.

Lịch sử watch phân biệt Nhận ký gửi/Gửi đối tác, mở đúng hồ sơ và chỉ hiện tiền quyết toán sau chốt bán. Bán qua đối tác lưu tham chiếu trên hồ sơ, không tự tạo Order; báo cáo chỉ dựa trên Order không tính đây là đơn bán trực tiếp. Khoản thu đối tác vẫn vào Payment hiện có.

Hồ sơ ký gửi cũ thiếu metadata không được tự suy diễn chiều hoặc công thức; cần đối chiếu riêng. Chưa có điều chỉnh quyết toán đã khóa. Hoàn/hủy đơn đã chốt ký gửi bị chặn để đối chiếu trước, tránh trả tồn kho khi đã chi tiền cho chủ.

## Xem nhanh

Trigger/provider tại admin shell mở BusinessEntityPreview hiện có khi người dùng bấm. Watch ID hoặc Product ID đều được resolver nhận; giữ quyền TASK_VIEW cũ. Người thiếu quyền nhận thông báo, không gọi API riêng vượt quyền.

Áp dụng ở thumbnail công việc/đầu việc, dòng watch đơn hàng, watch liên kết trong phiếu nhập, hàng đợi Media, danh sách kỹ thuật và hồ sơ ký gửi. Trong link/button có hành vi riêng dùng `interactive={false}` để tránh nút lồng. Click/Enter không kích hoạt hàng cha; đóng trả focus, giữ bản nháp.

## Kiểm chứng và staging

Contract tests kiểm tra ba cách chia tiền, VND/bounds, nhận diện watch. Browser fixture dùng form và trigger/provider/host thật; HTTP/navigation/payment panel/nội dung preview là ports giả lập. Không thay thế smoke dữ liệu thật.

DB script chỉ cho phép localhost database `watch_shop_consignment_test`: nhận/gửi/trả/bán/quyết toán, payment core thật, cạnh tranh tạo hồ sơ, masking và projection. Workflow PR dựng schema cũ, áp migration additive rồi chạy tsc/lint/contract/DB/browser.

Staging theo `docs/deployment/staging-deployment-runbook.md`: backup và restore rehearsal tách biệt, kiểm tra image cũ/schema mới, giữ env/OAuth/worker/private ingress, rollback image. Migration thêm cột nullable/index; không đảo migration khi rollback app. Không dùng script production. Khi chuẩn bị nhánh, Cloud báo `vpn_enrollment_failed`; chưa vào NAS hoặc deploy staging. Mở PR không có nghĩa đã deploy.
