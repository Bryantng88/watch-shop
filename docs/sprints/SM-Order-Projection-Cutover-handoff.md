# Order Projection Cutover — handoff

## Kết quả

Admin Order List và Order Detail đã chuyển sang persistent projection:

- `order-list`
- `order-detail`

Màn edit vẫn đọc source vì đây là command-preparation surface. List và Detail là read surfaces nên không ghi ngược vào Order.

## Event contract

Order phát các event:

- `order.created`
- `order.updated`
- `order.posted`
- `order.verified`
- `order.rejected`
- `order.cancelled`
- `order.paid`
- `order.completed`

Hai projection còn subscribe Payment và Shipment events. Vì vậy thay đổi payment settlement, COD, shipment delivery/return/cancel sẽ rebuild đúng Order liên quan mà UI không cần hydrate chéo domain.

## List projection

Mỗi row lưu:

- identity, customer và source;
- domain status, derived display status và verification;
- Payment totals, remaining amount và payment flow;
- active/latest Shipment cùng progress events;
- item count và tối đa bốn ảnh preview;
- created/updated timestamp.

Search, view, sub-filter, sort, pagination và counts chạy trên `ProjectionRecord`. Tất cả tab-count được gộp vào một aggregate SQL.

Quan trọng: đã xóa `syncCompletedDeliveredOrders()` khỏi đường đọc. Việc mở Order List không còn update Order hoặc Watch inventory.

## Detail projection

Order Detail đọc snapshot đầy đủ từ `order-detail`. Order, Payment hoặc Shipment event đều refresh snapshot. Nếu một Order chưa có projection, detail có fallback rebuild đúng một Order.

## Backfill

`npm run order:backfill-list-projection`

Backfill chỉ đọc Order và ghi `ProjectionRecord`; không phát event, không tạo Payment/Shipment, không gửi notification.

Kết quả dev ngày 2026-07-24:

- source Order: 70;
- Order List projection: 70;
- Order Detail projection: 70;
- chạy lại List: trước 70, sau 70.

## UI

Order List giữ command/actions hiện hữu nhưng dữ liệu đến từ projection. UI đã chuyển sang shared `BusinessListShell` giống Watch/Acquisition:

- gradient business page header và action tạo Order;
- dashboard có overview, status breakdown và recent activity;
- filter/view/sub-filter nằm trong một `BusinessListFilterBar`; các toolbar, tab và sub-filter component cũ đã được xóa;
- table nối liền filter surface, dùng density/border/radius chuẩn business list;
- table dùng cùng min-width, horizontal overflow, header density và row spacing của Watch List;
- cột Order chỉ còn thumbnail, mã đơn và metadata dạng text; toàn bộ signal icon cũ đã bỏ.

## Kiểm tra

- `npm run order:smoke-list-projection`
- ESLint cho event, projection, list/detail services, UI và scripts.

Smoke dev:

- list projection 70/70;
- detail projection 70/70;
- trang đầu 20/20 row có ảnh;
- detail projection read khoảng 178 ms;
- list + counts khoảng 1.4 giây ở lượt smoke cuối trên remote dev DB.

Full TypeScript check của repo vẫn bị chặn bởi các file syntax lỗi có sẵn trong `src/note.ts` và `component for chatGPT`.
