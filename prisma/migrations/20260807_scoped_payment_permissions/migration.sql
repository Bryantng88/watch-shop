-- Split coarse Payment permissions by business owner. Legacy assignments map
-- to ALL to preserve access until roles are deliberately narrowed in Role UI.
INSERT INTO "Permission" ("id", "code", "description")
VALUES
  (gen_random_uuid()::text, 'ORDER_PAYMENT_VIEW', 'Xem thanh toán đơn bán'),
  (gen_random_uuid()::text, 'ORDER_PAYMENT_CREATE', 'Tạo thanh toán đơn bán'),
  (gen_random_uuid()::text, 'ORDER_PAYMENT_UPDATE', 'Hoàn tất thanh toán đơn bán'),
  (gen_random_uuid()::text, 'ORDER_PAYMENT_DELETE', 'Hủy thanh toán đơn bán'),
  (gen_random_uuid()::text, 'ACQUISITION_PAYMENT_VIEW', 'Xem thanh toán phiếu nhập'),
  (gen_random_uuid()::text, 'ACQUISITION_PAYMENT_CREATE', 'Tạo thanh toán phiếu nhập'),
  (gen_random_uuid()::text, 'ACQUISITION_PAYMENT_UPDATE', 'Hoàn tất thanh toán phiếu nhập'),
  (gen_random_uuid()::text, 'ACQUISITION_PAYMENT_DELETE', 'Hủy thanh toán phiếu nhập'),
  (gen_random_uuid()::text, 'SERVICE_PAYMENT_VIEW', 'Xem thanh toán dịch vụ'),
  (gen_random_uuid()::text, 'SERVICE_PAYMENT_CREATE', 'Tạo thanh toán dịch vụ'),
  (gen_random_uuid()::text, 'SERVICE_PAYMENT_UPDATE', 'Hoàn tất thanh toán dịch vụ'),
  (gen_random_uuid()::text, 'SERVICE_PAYMENT_DELETE', 'Hủy thanh toán dịch vụ'),
  (gen_random_uuid()::text, 'SHIPMENT_PAYMENT_VIEW', 'Xem thanh toán vận chuyển'),
  (gen_random_uuid()::text, 'SHIPMENT_PAYMENT_CREATE', 'Tạo thanh toán vận chuyển'),
  (gen_random_uuid()::text, 'SHIPMENT_PAYMENT_UPDATE', 'Hoàn tất thanh toán vận chuyển'),
  (gen_random_uuid()::text, 'SHIPMENT_PAYMENT_DELETE', 'Hủy thanh toán vận chuyển'),
  (gen_random_uuid()::text, 'PAYMENT_VIEW_ALL', 'Xem thanh toán mọi business'),
  (gen_random_uuid()::text, 'PAYMENT_CREATE_ALL', 'Tạo thanh toán mọi business'),
  (gen_random_uuid()::text, 'PAYMENT_UPDATE_ALL', 'Hoàn tất thanh toán mọi business'),
  (gen_random_uuid()::text, 'PAYMENT_DELETE_ALL', 'Hủy thanh toán mọi business')
ON CONFLICT ("code") DO UPDATE SET "description" = EXCLUDED."description";

INSERT INTO "_RolePermissions" ("A", "B")
SELECT next_permission."id", role_permission."B"
FROM "_RolePermissions" role_permission
JOIN "Permission" legacy_permission ON legacy_permission."id" = role_permission."A"
JOIN "Permission" next_permission ON next_permission."code" = CASE legacy_permission."code"
  WHEN 'PAYMENT_VIEW' THEN 'PAYMENT_VIEW_ALL'
  WHEN 'PAYMENT_CREATE' THEN 'PAYMENT_CREATE_ALL'
  WHEN 'PAYMENT_UPDATE' THEN 'PAYMENT_UPDATE_ALL'
  WHEN 'PAYMENT_DELETE' THEN 'PAYMENT_DELETE_ALL'
END
WHERE legacy_permission."code" IN ('PAYMENT_VIEW', 'PAYMENT_CREATE', 'PAYMENT_UPDATE', 'PAYMENT_DELETE')
ON CONFLICT ("A", "B") DO NOTHING;

INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" permission
CROSS JOIN "Role" role
WHERE role."name" = 'ADMIN'
ON CONFLICT ("A", "B") DO NOTHING;

DELETE FROM "_RolePermissions"
WHERE "A" IN (SELECT "id" FROM "Permission" WHERE "code" IN ('PAYMENT_VIEW', 'PAYMENT_CREATE', 'PAYMENT_UPDATE', 'PAYMENT_DELETE'));

DELETE FROM "Permission" WHERE "code" IN ('PAYMENT_VIEW', 'PAYMENT_CREATE', 'PAYMENT_UPDATE', 'PAYMENT_DELETE');
