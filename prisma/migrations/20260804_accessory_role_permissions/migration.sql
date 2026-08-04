INSERT INTO "Permission" ("id", "code", "description")
VALUES
  (gen_random_uuid()::text, 'ACCESSORY_VIEW', 'Xem danh sach va chi tiet phu kien'),
  (gen_random_uuid()::text, 'ACCESSORY_CREATE', 'Tao phu kien va danh muc phu kien'),
  (gen_random_uuid()::text, 'ACCESSORY_UPDATE', 'Cap nhat ton kho va thong tin phu kien'),
  (gen_random_uuid()::text, 'ACCESSORY_DELETE', 'Xoa phu kien')
ON CONFLICT ("code") DO UPDATE
SET "description" = EXCLUDED."description";

INSERT INTO "Role" ("id", "name", "description")
VALUES (
  gen_random_uuid()::text,
  'ACCESSORY_MANAGER',
  'Quan ly danh muc, ton kho va nghiep vu phu kien'
)
ON CONFLICT ("name") DO UPDATE
SET "description" = EXCLUDED."description";

INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" AS permission
CROSS JOIN "Role" AS role
WHERE permission."code" IN (
  'ACCESSORY_VIEW',
  'ACCESSORY_CREATE',
  'ACCESSORY_UPDATE',
  'ACCESSORY_DELETE',
  'STRAP_ACQUISITION_VIEW',
  'STRAP_ACQUISITION_CREATE',
  'STRAP_ACQUISITION_UPDATE'
)
AND role."name" = 'ACCESSORY_MANAGER'
ON CONFLICT ("A", "B") DO NOTHING;

-- SALE_ADMIN owns the sales payment workflow and must be able to enter the
-- operation space as well as read and reconcile its payment items.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" AS permission
CROSS JOIN "Role" AS role
WHERE permission."code" IN ('TASK_VIEW', 'PAYMENT_VIEW', 'PAYMENT_UPDATE')
AND role."name" = 'SALE_ADMIN'
ON CONFLICT ("A", "B") DO NOTHING;
