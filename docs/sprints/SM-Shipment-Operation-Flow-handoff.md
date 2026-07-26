# Shipment Operation Flow — handoff

## Kết quả

Shipment của Order được quản lý trong flow `shipment-operation-core-flow` thuộc Space Vận hành:

1. `SHIPMENT_WAITING`: `DRAFT`, `READY`
2. `SHIPMENT_PROCESSING`: `SHIPPED`, `RETURNING`
3. `SHIPMENT_DONE`: `DELIVERED`, `RETURNED`, `CANCELLED`

Stage là projection của trạng thái Shipment, không phải một trạng thái nghiệp vụ thứ hai. Event consumer chịu trách nhiệm bind/move item giữa ba workspace; dashboard chỉ đọc projection.

## Event và projection

Các event chuẩn:

- `shipment.created`
- `shipment.updated`
- `shipment.shipped`
- `shipment.delivered`
- `shipment.returning`
- `shipment.returned`
- `shipment.cancelled`

Mỗi mutation Shipment phát event sau khi transaction nghiệp vụ thành công. Event được đăng ký cho coordination, timeline và projection; các milestone vận hành còn đi qua notification consumer.

Projection `shipment-operation-queue` lưu:

- Shipment/order identity và trạng thái;
- customer, địa chỉ, carrier, tracking;
- ảnh và số item của Order;
- shipment fee/COD payment signal;
- stage, search text và sort time.

Dashboard phân trang trực tiếp trên `ProjectionRecord`, không hydrate toàn bộ Shipment/Order/Payment khi đổi stage.

## Action

- Waiting: `dispatch_shipment`
- Processing + `SHIPPED`: `mark_shipment_delivered`, `mark_shipment_returning`
- Processing + `RETURNING`: `receive_shipment_return`
- Done: không có action

Action hiển thị form từ Operational Blueprint và chạy qua `shipment-operation-action-adapter`. Adapter gọi application/service hiện hữu, không viết trạng thái Shipment trực tiếp.

## Payment invariant

- Dispatch vẫn tạo shipment fee Payment theo `shippingFeePayer`.
- Delivery COD vẫn tạo/cập nhật Payment thu hộ.
- Receive return vẫn tạo return-fee Payment và reverse/cancel COD theo logic Shipment hiện hữu.
- Payment mutation được publish trước Shipment milestone để projection đọc được signal Payment mới nhất.

## Backfill

`npm run shipment:backfill-operation`

Backfill:

- map Shipment hiện hữu vào đúng workspace theo trạng thái;
- rebuild projection;
- không phát BusinessEvent;
- không gọi Shipment application/service;
- không tạo Payment hay notification;
- idempotent theo cặp workspace/target.

Kết quả dev ngày 2026-07-24:

- 36 Shipment;
- 1 Processing, 35 Done;
- lần đầu tạo 36 binding;
- lần hai: `created=0`, `moved=0`, `deduplicated=0`.

## Kiểm tra

- `npm run shipment:smoke-operation`
- `npm run shipment:smoke-dashboard -- shipment-waiting`
- `npm run shipment:smoke-dashboard -- shipment-processing`
- `npm run shipment:smoke-dashboard -- shipment-done`

Smoke dashboard Processing trên dev: projection query khoảng 334–424 ms, tổng dashboard khoảng 1.27–1.59 giây; item có ảnh và action form đầy đủ.

Full `tsc --noEmit` hiện chưa phải signal hợp lệ do các file lỗi có sẵn ngoài phạm vi Shipment (`src/note.ts` và thư mục `component for chatGPT`). Các file Shipment/integration đã qua ESLint riêng.
