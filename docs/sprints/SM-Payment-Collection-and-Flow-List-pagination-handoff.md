# Payment Collection và Flow List Pagination Handoff

Ngày cập nhật: 2026-07-24

## Mục tiêu

Tài liệu này ghi lại phần refactor Payment Collection và flow list để có thể
tiếp tục công việc trên máy khác mà không phải khảo sát lại từ đầu.

Các mục tiêu đã xử lý:

- Payment không bị mất hoặc nhân đôi khi chuyển từ `Cần đối soát` sang
  `Settled`.
- `Payment.status` là nguồn sự thật để xác định stage hiển thị.
- Mở dashboard không còn chạy reconcile có ghi database.
- Flow list chỉ tải stage và trang đang xem.
- Pagination dùng chung cho Payment, Technical, Media và các workspace list.
- Hai cột `Activity` và `Comment` được gộp thành `Thao tác cuối`.

## Quyết định kiến trúc

### Payment stage

Không tạo thêm bảng FlowMembership cho Payment ở thời điểm này.

Stage được suy trực tiếp từ business domain:

- `UNPAID` -> `PAYMENT_REVIEW`
- `PAID`, `COLLECTED`, `REFUNDED`, `CANCELED` và các trạng thái terminal
  tương đương -> `PAYMENT_SETTLED`

`TaskExecution` vẫn được giữ làm adapter tương thích cho:

- activity;
- comment;
- workflow cũ;
- event routing;
- lịch sử dữ liệu đã tồn tại.

Dashboard không được dùng `TaskExecution.taskItemId` làm nguồn sự thật cho
Payment stage nữa.

### Pagination chung

Contract flow list hiện nhận:

- `flowStage`
- `flowPage`
- `flowPageSize`

Mặc định:

- page: `1`
- page size: `20`
- giới hạn tối đa: `100`

`listTaskItemQueueItems` đã hỗ trợ phân trang ở tầng query binding. Đây là
đường dùng chung cho các flow list, không phải implementation riêng của
Payment.

Payment có business loader riêng vì stage được suy từ `Payment.status`, nhưng
vẫn dùng cùng API, DTO và UI pagination.

## Những thay đổi chính

### Payment loader

File:

- `src/domains/task/server/business-binding.service.ts`

Đã thêm:

- `isPaymentCollectionSettledStatus`
- `listPaymentCollectionQueueItems`

Loader:

- query đúng Payment status của stage;
- áp dụng `skip/take`;
- chỉ lấy binding của các Payment trên trang;
- chỉ lấy activity của các target trên trang;
- dựng preview đầy đủ cho acquisition, order và service payment.

### Activity query theo target

File:

- `src/domains/task/server/business-binding.repo.ts`

Đã thêm:

- `findQueueActivitiesByTaskItemTargets`

Mục đích là tránh tải toàn bộ lịch sử activity của một workspace khi trang chỉ
hiển thị 10 hoặc 20 item.

### Dashboard contract

Files:

- `src/domains/coordination/server/coordination-dashboard.service.ts`
- `src/domains/coordination/server/coordination-dashboard.types.ts`
- `src/app/api/admin/coordination/operation/dashboard/route.ts`

DTO có thêm:

```ts
flowItemsPagination: {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
```

Dashboard:

- chỉ load task item tương ứng stage đang chọn;
- tính total riêng bằng query count;
- Payment count lấy từ `Payment`;
- flow generic count lấy từ active `TaskExecution`;
- không còn cờ `reconcileBindings` trong API.

### UI

Files:

- `src/domains/coordination/ui/OperationCoordinationWorkspace.tsx`
- `src/domains/coordination/ui/FlowItemListView.tsx`

Đã thực hiện:

- đổi stage sẽ fetch stage đó, page 1;
- đổi trang sẽ fetch đúng stage và page;
- badge count các stage lấy từ `workTickets`, không đếm từ trang hiện tại;
- server refresh không ghi đè slice Settled đang mở bằng Review mặc định;
- footer có `Trước`, `Sau`, trang hiện tại và tổng trang;
- `Activity` + `Comment` được thay bằng `Thao tác cuối`;
- `Thao tác cuối` hiện chỉ hiển thị `latestActivityTitle`;
- chưa có click mở activity drawer/modal.

## Payment binding invariant

Đã thêm migration:

- `prisma/migrations/20260724_payment_collection_active_binding_invariant/migration.sql`

Migration:

1. Dọn binding Payment active bị trùng.
2. Ưu tiên binding đúng stage theo business status.
3. Tạo partial unique index:

```text
taskId + targetType + targetId
```

với điều kiện:

- target type là Payment;
- action không phải Cancelled;
- binding đang có task item.

Migration này chưa được tự động apply vì cần xác nhận `.env` trên máy chạy
đang trỏ development hay production database.

Ngoài unique index, event consumer đã có:

- transaction;
- advisory lock theo Payment;
- chuyển trực tiếp binding hiện hữu;
- hủy binding active dư;
- retry/idempotency không tạo khoảng hở tháo binding rồi tạo lại.

File:

- `src/domains/coordination/server/coordination-event-consumer.ts`

## Kết quả smoke test

### Payment invariant trước pagination

```text
Tổng Payment hợp lệ: 211
Cần đối soát: 15
Settled: 196
Unique target: 211
Invariant: true
```

### Pagination dùng chung

Với `pageSize=10`:

```text
Payment:
  items: 10
  total: 15
  totalPages: 2
  unique: 10

Technical:
  items: 10
  total: 29
  totalPages: 3
  unique: 10

Media:
  items: 6
  total: 6
  totalPages: 1
  unique: 6
```

Các file thay đổi liên quan đã qua:

- ESLint;
- Prisma validate;
- `git diff --check`;
- smoke test chỉ đọc trên database hiện tại.

TypeScript toàn repository vẫn có các lỗi cũ không thuộc phần này tại
acquisition, media, blueprint và một số file ghi chú cũ.

## Việc cần làm tiếp theo

### 1. Server-side search, filter và sort

Đây là ưu tiên cao nhất.

Hiện pagination đã chạy ở server nhưng một số search/filter vẫn lọc trên
`items` của trang hiện tại. Hậu quả: item ở trang 2 có thể không được tìm thấy
khi user đang ở trang 1.

Cần đưa vào API chung:

- `flowQuery`
- `flowStatus`
- `flowPaymentStatus`
- `flowSort`

Thứ tự đúng:

```text
filter -> search -> sort -> count -> paginate
```

Không được paginate trước rồi mới search/filter.

### 2. Đồng bộ state lên URL

Cần lưu:

- view/mode;
- stage;
- page;
- page size;
- search;
- filter;
- sort.

Mục tiêu:

- reload không mất trạng thái;
- back/forward hoạt động đúng;
- có thể copy URL gửi người khác.

### 3. Board lazy loading

List đã có pagination chung. Board không nên dùng pagination cứng giống table.

Khuyến nghị cho Technical và Media board:

- lazy-load riêng từng column;
- mỗi column tải 20 item đầu;
- `Load more` hoặc infinite scroll trong column;
- count column vẫn lấy từ aggregate query;
- không tải detail/activity đầy đủ cho card chưa hiển thị.

### 4. Activity drawer

Cột `Thao tác cuối` hiện chưa clickable.

Khi triển khai:

- click vào cell mở drawer hoặc modal;
- fetch activity theo `targetType + targetId`;
- phân trang activity riêng;
- comment/reply tải trong drawer;
- không đưa toàn bộ activity trở lại payload flow list.

### 5. Tối ưu latest activity query

Hiện activity đã giới hạn theo target trên trang, nhưng vẫn có thể tối ưu thêm
bằng SQL/window query để chỉ trả activity mới nhất trên mỗi target.

Mục tiêu:

```sql
ROW_NUMBER() OVER (
  PARTITION BY target_type, target_id
  ORDER BY occurred_at DESC
)
```

List chỉ cần:

- tiêu đề thao tác cuối;
- thời gian;
- actor.

### 6. Apply migration đúng môi trường

Trước khi chạy:

1. Xác nhận database host/name, không in password.
2. Backup hoặc snapshot nếu là production.
3. Chạy audit duplicate Payment binding.
4. Apply migration.
5. Chạy lại invariant query.

### 7. Dọn Workspace runtime cũ

Sau khi Payment ổn định:

- xóa hoặc chuyển `reconcilePaymentCollectionBindings` thành script repair thủ
  công, không để trong request path;
- giảm workflow snapshot bị lặp trong mỗi `TaskExecution`;
- đưa Technical và Media stage dần về business domain source;
- giữ compatibility adapter trong giai đoạn migration;
- không xóa TaskItem/TaskExecution hàng loạt trước khi activity và workflow đã
  có đường đọc thay thế.

## Lưu ý khi tiếp tục trên máy khác

1. Pull đúng toàn bộ working tree/change set hiện tại.
2. Chạy `npx prisma validate`.
3. Không chạy migration deploy trước khi xác nhận database target.
4. Mở Payment Collection và kiểm tra:
   - Review count;
   - Settled count;
   - đổi stage;
   - đổi trang;
   - đối soát một Payment;
   - split Payment;
   - bulk reconcile.
5. Mở Technical và Media list để kiểm tra stage/page dùng chung.
6. Không sửa riêng Payment pagination; mọi thay đổi pagination tiếp theo phải
   đi qua flow list contract chung.
