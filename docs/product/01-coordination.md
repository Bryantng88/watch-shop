# Điều phối (Coordination)

## Mục tiêu

Điều phối là trung tâm vận hành của doanh nghiệp.

Điều phối không phải nơi nhập liệu.

Điều phối không thay thế nghiệp vụ.

Điều phối chỉ:

- điều hành
- theo dõi
- cộng tác
- báo cáo
- tự động hóa

## Chu kỳ điều phối

Điều phối vận hành theo từng chu kỳ.

Ví dụ:

- Tuần 27
- Tuần 28
- Tuần 29

Mỗi chu kỳ có nhiều Phiếu xử lý.

Chu kỳ giúp đội ngũ nhìn được khối lượng công việc, tiến độ xử lý, điểm nghẽn và kết quả vận hành theo một khoảng thời gian rõ ràng.

## Phiếu xử lý

Phiếu xử lý là đơn vị làm việc chính trong Điều phối.

Một Phiếu xử lý đại diện cho một nhóm việc cần được điều hành, theo dõi và cộng tác đến khi hoàn tất.

Một Phiếu xử lý có thể xử lý nhiều Business Objects.

Ví dụ:

Phiếu: Đăng bài

Business Objects trong phiếu:

- Watch A
- Watch B
- Watch C

Phiếu xử lý không thay thế màn hình nghiệp vụ của Watch, Order, Service hoặc các domain khác. Phiếu xử lý chỉ gom các nghiệp vụ liên quan vào cùng một bối cảnh làm việc để đội ngũ phối hợp hiệu quả hơn.

## Business Binding

Business Binding thể hiện nghiệp vụ đang nằm trong phạm vi xử lý của một Phiếu xử lý.

Business Binding có hai nguồn:

AUTO

BusinessEvent

↓

Router

↓

Binding

MANUAL

User thêm nghiệp vụ.

AUTO phù hợp với các nghiệp vụ phát sinh từ hoạt động thật trong hệ thống.

MANUAL phù hợp khi người dùng chủ động đưa một nghiệp vụ vào phiếu để theo dõi hoặc phối hợp.

Trong góc nhìn Product, Business Binding không chỉ là liên kết. Business Binding là hàng đợi nghiệp vụ mà Phiếu xử lý cần quan tâm.

## Activity

Activity là Conversation Unit.

Một BusinessEvent

↓

Một Activity.

Discussion cũng là Activity.

Replies chỉ có một cấp.

Activity giúp người dùng hiểu chuyện gì đã xảy ra, ai liên quan, lý do là gì, và đội ngũ đã trao đổi gì quanh sự kiện đó.

BusinessFeedback thuộc Activity liên quan.

User Reply là trao đổi trong Activity.

Feedback nghiệp vụ không phải comment của user.

## Workflow

Workflow thuộc Phiếu xử lý.

Workflow không thuộc Business.

Workflow được trigger bởi:

- EVENT
- MANUAL
- TIME
- các trigger khác nếu sản phẩm cần mở rộng

BusinessEvent chỉ là một Trigger.

Workflow giúp Phiếu xử lý tự động hóa các bước điều phối như nhắc việc, chuyển trạng thái, phân công hoặc tạo hành động tiếp theo.

## Dashboard

Dashboard không query Business.

Dashboard query Coordination.

Dashboard dùng dữ liệu Điều phối để trả lời các câu hỏi vận hành:

- Chu kỳ nào đang có nhiều việc?
- Phiếu xử lý nào đang bị nghẽn?
- Nghiệp vụ nào cần chú ý?
- Hoạt động nào tạo nhiều feedback?
- Đội ngũ đang cộng tác ở đâu?

Dashboard không thay thế báo cáo nghiệp vụ chuyên sâu của từng domain.

## Nguyên tắc

Business Domain

↓

BusinessEvent

↓

Coordination

↓

BusinessBinding

↓

Activity

↓

Workflow

↓

Notification

Điều phối nhận tín hiệu từ Business Domain, tổ chức tín hiệu đó thành ngữ cảnh làm việc, và hỗ trợ đội ngũ theo dõi, cộng tác, tự động hóa.

Điều phối không sở hữu dữ liệu nghiệp vụ gốc.

Điều phối không quyết định thay nghiệp vụ.

Điều phối làm cho vận hành rõ ràng hơn.

## Open Questions

- Một chu kỳ điều phối nên được tạo thủ công, tự động, hay cả hai?
- Phiếu xử lý nên có những loại mặc định nào?
- Khi nào một Business Object nên tự động được đưa vào Phiếu xử lý?
- Khi nào một Phiếu xử lý được xem là hoàn tất?
- Dashboard Coordination cần những chỉ số ưu tiên nào ở giai đoạn đầu?
- Workflow nào nên là mặc định cho từng loại Phiếu xử lý?
- Notification nào là cần thiết, notification nào nên để người dùng cấu hình?
