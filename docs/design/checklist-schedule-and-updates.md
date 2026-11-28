# Lịch và cập nhật riêng từng đầu việc

Công việc có đầu việc dùng lịch tổng hợp, không nhập hạn tổng riêng. Bấm tên đầu việc hoặc thao tác Chi tiết và cập nhật để mở vùng sửa ngay trong hàng; lưu tên, bắt đầu, hạn chót và một cập nhật riêng. Không có bộ chọn đầu việc/cập nhật chung bên dưới khi đã có đầu việc. Công việc không có đầu việc giữ form lịch/cập nhật hiện tại.

- Có thể chỉ đặt hạn chót; có bắt đầu thì phải có hạn chót. Hai mốc bằng nhau được phép. Giờ nhập/hiển thị UTC+7.
- Lịch tổng lấy bắt đầu sớm nhất (hoặc hạn chót nếu không có bắt đầu) và hạn chót trễ nhất, bao gồm đầu việc đã xong. Mục chưa có lịch không tạo mốc giả; giao diện hiển thị số mục chưa có lịch.
- Chỉ có một mốc thì lưu parent dạng point-in-time theo contract hiện tại. Xóa hết lịch/đầu việc sẽ xóa lịch tổng. Việc duy trì vẫn không có lịch tổng hay lặp trên calendar.
- Thêm, sửa, xóa và gộp đầu việc tính lại lịch parent trong transaction dưới cùng khóa TaskItem. Gộp giữ nguyên ID/lịch/lịch sử của đầu việc. Yêu cầu media trong ngày khởi tạo lịch đầu việc theo ngày yêu cầu.
- Không nhập ngược thay đổi lịch Google vào công việc có đầu việc. Sửa/xóa lịch đầu việc cập nhật các liên kết Google hiện có; lỗi Google không đảo ngược dữ liệu đã lưu và được báo riêng.
- Share EDITOR của một đầu việc chỉ sửa/xem lịch sử đầu việc đó. Parent projection chỉ tổng hợp lịch từ các đầu việc người nhận thấy; không lộ lịch/ghi chú/hoạt động của sibling. VIEWER và công việc đã đóng chỉ đọc.
- Lịch sử gắn checklistItemId; thay đổi tên/lịch ghi mốc trước/sau, cập nhật riêng là mốc mới, không đánh dấu hoàn thành. Lịch sử hiển thị tập trung ở cuối modal. Người chỉ được chia sẻ đầu việc chỉ thấy các mốc của những đầu việc họ được xem. Parent vẫn giữ toàn bộ lịch sử cho người có quyền xem parent.
- Bản sửa giữ version khi bắt đầu nhập; nếu đầu việc đã đổi trên server, từ chối lưu bản cũ. Nút lưu chặn double-click, lỗi giữ draft.

## Migration

Hai cột nullable trên TaskItemChecklist; không xóa/đổi cột cũ. Backfill lịch parent hiện có xuống các đầu việc để giữ nguyên lịch đang vận hành. Chưa có lịch thì giữ null. Đầu việc đầu tiên thêm vào công việc đã có lịch kế thừa lịch đó; các mục thêm sau chưa có lịch. Cần apply migration trước khi chạy app mới. Production chưa được thay đổi bởi PR.

## Kiểm tra

- TypeScript với Prisma client riêng; scoped ESLint.
- checklist-schedule.test.ts: khoảng sớm/trễ, không lịch, point-in-time, invalid/reversed.
- check-work-checklist-mobile.cjs: UI thật 320–1440px, owner/editor/viewer, sửa và hoàn thành.
- check-work-modal-feedback.cjs: cập nhật riêng, ngày giờ UTC+7, giữ draft khi lỗi, form chung chỉ cho việc không có đầu việc.
- smoke-work-responsive-ui.cjs: danh sách/lịch và quyền hiện có.
- check-checklist-schedule-db.ts trong CI PostgreSQL test: phạm vi quyền, lịch đầu việc đã hoàn thành, version cũ, projection riêng tư, chặn ghi đè lịch parent, xóa và hủy.

## Phản hồi sau khi lưu

Lưu thành công hiện toast, mỗi hàng có nội dung cập nhật riêng hiện “Có cập nhật” kèm thời điểm. Đây là chỉ báo có nội dung cập nhật, không phải trạng thái chưa đọc. Bấm chỉ báo sẽ cuộn tới lịch sử cập nhật chung; không có lịch sử hay bản sao nội dung bên trong form sửa đầu việc. Truy vấn lấy một cập nhật gần nhất cho mỗi đầu việc được phép xem, không phụ thuộc 20 mốc gần nhất của parent; không thêm truy vấn này vào tải danh sách/index.

Preview local lưu thay đổi và lịch sử mẫu theo đầu việc vào sessionStorage để tải lại cùng tab vẫn xem được. Đây vẫn là dữ liệu giả lập, không ghi vào dữ liệu thật.
