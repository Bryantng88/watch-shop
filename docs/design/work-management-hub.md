# Đề xuất: Quản lý công việc

Phạm vi người dùng đã chọn: một nơi tổng hợp cả việc tự tạo và việc từ các bảng
nghiệp vụ. Tài khoản đã kết nối Google tự nhận lịch cho việc Ben tạo; nếu giao
cho người khác thì cả người tạo và người phụ trách đều nhận lịch, mỗi người dùng
kết nối của chính mình. Tài khoản chưa kết nối được bỏ qua.

## Vì sao cách phân nhóm hiện tại khó dùng

“Cá nhân” nói về phạm vi sở hữu, “Media/Technical/Sales” nói về mảng hoạt động,
còn “Công việc” lại là tên chung cho mọi mục. Chúng không nên cạnh tranh trong
cùng một bộ nhãn. Một việc có thể do tôi tạo, giao cho Vi, thuộc media, liên quan
đồng hồ và có deadline: một nhãn duy nhất không diễn tả được các ý đó.

## Cấu trúc đề xuất

| Thông tin | Ý nghĩa và ví dụ |
| --- | --- |
| Loại | Công việc cần hoàn thành / Sự kiện diễn ra vào một thời điểm |
| Nguồn | Tạo trực tiếp, Vận hành, Kỹ thuật, Media, Bán hàng; lấy từ nguồn thật |
| Người phụ trách | Ai làm; tách khỏi người tạo/giao và người được chia sẻ |
| Trạng thái | Cần làm, Đang làm, Chờ phản hồi, Hoàn tất; phản ánh quy trình nguồn |
| Lịch và hạn | Thời gian thực hiện và hạn hoàn thành có ý nghĩa riêng |
| Nhãn tùy chọn | Dự án/chủ đề như Website, Khách VIP, Chiến dịch Tết; không quyết định quyền |

“Ben” là cách tạo việc, không phải một loại công việc hay bảng nghiệp vụ riêng.
Nguồn “Tạo trực tiếp” bao gồm việc nhập tay và việc Ben tạo. Mã/đường dẫn hệ thống
cũ có thể giữ nguyên dù tên hiển thị là “Quản lý công việc”.

## Bố cục để xem trước

```text
Quản lý công việc                         [Thêm việc] [Nhờ Ben]
Hôm nay  ·  Sắp tới  ·  Quá hạn  ·  Chờ phản hồi  ·  Đã xong

Phạm vi: Tôi phụ trách | Tôi giao | Được chia sẻ | Tất cả có quyền
Bộ lọc: Người phụ trách · Nguồn · Nhãn · Ưu tiên · Khoảng ngày
Chế độ: Danh sách | Bảng | Lịch

Tên việc                  Người phụ trách   Hạn           Nguồn
Chụp bộ ảnh Longines       Vi                12/11 17:00   Media
Kiểm tra chiếc Tissot      Nam               13/11 12:00   Kỹ thuật
Cập nhật giá dịch vụ       Vi                14/11 17:00   Tạo trực tiếp
```

Danh sách là chế độ chính; lịch là một chế độ riêng thay vì luôn chiếm nửa màn
hình. Dòng việc ưu tiên tên, người phụ trách, hạn và tiến độ. Chỉ hiện nhãn tùy
chọn khi có giá trị; bỏ badge “Cá nhân / Nhắc việc” lặp lại trên mọi dòng.
“Tôi phụ trách” và “Tôi giao” phải tách rõ: người tạo chưa chắc là người thực hiện.
Sự kiện không có nút hoàn thành và không bị đếm thành công việc quá hạn.

## Tổng hợp nghiệp vụ mà vẫn giữ đúng hệ thống

- Mỗi nguồn cung cấp một bản đọc có phân quyền, dùng cùng định dạng hiển thị.
  Không sao chép phiếu kỹ thuật hoặc task vận hành thành một task cá nhân thứ hai.
- Một dòng có ID nguồn ổn định và liên kết về màn hình gốc. Đơn hàng/phiếu nhập
  là ngữ cảnh liên quan, không tự biến mọi hồ sơ thành một công việc phải làm.
- Tất cả số lượng, tìm kiếm, bộ lọc, xem chi tiết và lịch đều dùng cùng phạm vi
  được phép. Đổi tên màn hình không cấp quyền xem toàn công ty hoặc quyền sửa.
- Trạng thái chuẩn hóa chỉ để hiển thị. Thao tác cập nhật phải gọi luồng gốc,
  giữ nguyên kiểm tra quyền, checklist, duyệt và tác động tài chính/kho.
- Việc tự tạo đã có liên kết nghiệp vụ vẫn giữ một dòng; các mục khác nguồn chỉ
  được gộp khi có bằng chứng liên kết chuẩn, không đoán từ tên hoặc người nhận.
- Nhãn/nhóm cũ được giữ và ánh xạ có kiểm chứng khi chuyển đổi. Không xóa nhãn,
  đổi mã nhóm hoặc di chuyển dữ liệu thật chỉ vì thay tên giao diện.

## Phần đã triển khai trong thay đổi này

- Đổi tên các điểm vào chính sang “Quản lý công việc”, giữ đường dẫn hiện có.
- Việc/sự kiện có ngày được Ben tạo sau khi duyệt sẽ tự đồng bộ Google cho
  người tạo và người phụ trách đã kết nối. Người chỉ xem không nhận sự kiện.
- Kiểm tra lại quyền/kết nối khi duyệt; replay không tạo lại task hoặc gửi lại
  đồng bộ. Google lỗi không rollback việc đã lưu và được báo theo từng tài khoản.
- ID sự kiện ổn định hỗ trợ hòa giải khi Google đã tạo nhưng phản hồi bị mất.
  Không đưa thêm dữ liệu nghiệp vụ vào sự kiện ngoài thông tin task hiện có.
- Mỗi bản lịch mới mang phiên bản công việc và dấu vết lịch đã xuất. Tải lại
  một bản xuất chưa sửa không làm mất giờ gốc; bản lịch cũ của người khác không
  được ghi đè lịch công việc đã thay đổi. Chỉnh lịch trên Google chỉ nhập khi
  phiên bản còn khớp; lịch cũ cần đồng bộ lại trước khi tiếp tục chỉnh hai chiều.
- Việc chưa đặt ngày không bị gán vào hôm nay. Khi bổ sung lịch, người có quyền
  có thể dùng nút đồng bộ hiện có. Không tự đẩy toàn bộ việc cũ lên Google.

Màn tổng hợp nhiều nguồn, bỏ các nhóm cũ và bố cục mới ở trên là bản đề xuất để
chốt thiết kế tiếp theo, chưa phải chức năng đã hoàn tất trong PR này. Phần đó
cần kiểm kê từng nguồn và quyền đọc trước khi nối vào một màn hình chung.
