-- Acquisition permissions are split by business scope and action.
-- The server derives the scope from persisted item product types.
INSERT INTO "Permission" ("id", "code", "description")
VALUES
  (gen_random_uuid()::text, 'WATCH_ACQUISITION_VIEW', 'Xem phiếu nhập đồng hồ'),
  (gen_random_uuid()::text, 'WATCH_ACQUISITION_CREATE', 'Tạo phiếu nhập đồng hồ'),
  (gen_random_uuid()::text, 'WATCH_ACQUISITION_UPDATE', 'Cập nhật phiếu nhập đồng hồ'),
  (gen_random_uuid()::text, 'WATCH_ACQUISITION_APPROVE', 'Duyệt phiếu nhập đồng hồ'),
  (gen_random_uuid()::text, 'WATCH_ACQUISITION_DELETE', 'Hủy phiếu nhập đồng hồ'),
  (gen_random_uuid()::text, 'ACCESSORY_ACQUISITION_VIEW', 'Xem phiếu nhập phụ kiện'),
  (gen_random_uuid()::text, 'ACCESSORY_ACQUISITION_CREATE', 'Tạo phiếu nhập phụ kiện'),
  (gen_random_uuid()::text, 'ACCESSORY_ACQUISITION_UPDATE', 'Cập nhật phiếu nhập phụ kiện'),
  (gen_random_uuid()::text, 'ACCESSORY_ACQUISITION_APPROVE', 'Duyệt phiếu nhập phụ kiện'),
  (gen_random_uuid()::text, 'ACCESSORY_ACQUISITION_DELETE', 'Hủy phiếu nhập phụ kiện'),
  (gen_random_uuid()::text, 'ACQUISITION_VIEW_ALL', 'Xem mọi phiếu nhập'),
  (gen_random_uuid()::text, 'ACQUISITION_CREATE_ALL', 'Tạo phiếu nhập mọi phạm vi, kể cả phiếu hỗn hợp'),
  (gen_random_uuid()::text, 'ACQUISITION_UPDATE_ALL', 'Cập nhật mọi phiếu nhập'),
  (gen_random_uuid()::text, 'ACQUISITION_APPROVE_ALL', 'Duyệt mọi phiếu nhập'),
  (gen_random_uuid()::text, 'ACQUISITION_DELETE_ALL', 'Hủy mọi phiếu nhập')
ON CONFLICT ("code") DO UPDATE SET "description" = EXCLUDED."description";

-- Preserve the intent of existing role assignments.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT next_permission."id", role_permission."B"
FROM "_RolePermissions" role_permission
JOIN "Permission" legacy_permission ON legacy_permission."id" = role_permission."A"
JOIN "Permission" next_permission ON next_permission."code" = CASE legacy_permission."code"
  WHEN 'ACQUISITION_VIEW' THEN 'ACQUISITION_VIEW_ALL'
  WHEN 'ACQUISITION_CREATE' THEN 'ACQUISITION_CREATE_ALL'
  WHEN 'ACQUISITION_UPDATE' THEN 'ACQUISITION_UPDATE_ALL'
  WHEN 'ACQUISITION_APPROVE' THEN 'ACQUISITION_APPROVE_ALL'
  WHEN 'ACQUISITION_DELETE' THEN 'ACQUISITION_DELETE_ALL'
  WHEN 'STRAP_ACQUISITION_VIEW' THEN 'ACCESSORY_ACQUISITION_VIEW'
  WHEN 'STRAP_ACQUISITION_CREATE' THEN 'ACCESSORY_ACQUISITION_CREATE'
  WHEN 'STRAP_ACQUISITION_UPDATE' THEN 'ACCESSORY_ACQUISITION_UPDATE'
END
WHERE legacy_permission."code" IN (
  'ACQUISITION_VIEW', 'ACQUISITION_CREATE', 'ACQUISITION_UPDATE', 'ACQUISITION_APPROVE', 'ACQUISITION_DELETE',
  'STRAP_ACQUISITION_VIEW', 'STRAP_ACQUISITION_CREATE', 'STRAP_ACQUISITION_UPDATE'
)
ON CONFLICT ("A", "B") DO NOTHING;

-- Canonical defaults. These remain editable from Role & permissions in the UI.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" permission
CROSS JOIN "Role" role
WHERE (role."name" = 'SALE' AND permission."code" IN ('ACCESSORY_ACQUISITION_VIEW', 'ACCESSORY_ACQUISITION_CREATE'))
   OR (role."name" = 'ACCESSORY_MANAGER' AND permission."code" IN ('ACCESSORY_ACQUISITION_VIEW', 'ACCESSORY_ACQUISITION_CREATE', 'ACCESSORY_ACQUISITION_UPDATE'))
   OR (role."name" = 'ADMIN' AND permission."code" IN (
     'WATCH_ACQUISITION_VIEW', 'WATCH_ACQUISITION_CREATE', 'WATCH_ACQUISITION_UPDATE', 'WATCH_ACQUISITION_APPROVE', 'WATCH_ACQUISITION_DELETE',
     'ACCESSORY_ACQUISITION_VIEW', 'ACCESSORY_ACQUISITION_CREATE', 'ACCESSORY_ACQUISITION_UPDATE', 'ACCESSORY_ACQUISITION_APPROVE', 'ACCESSORY_ACQUISITION_DELETE',
     'ACQUISITION_VIEW_ALL', 'ACQUISITION_CREATE_ALL', 'ACQUISITION_UPDATE_ALL', 'ACQUISITION_APPROVE_ALL', 'ACQUISITION_DELETE_ALL'
   ))
ON CONFLICT ("A", "B") DO NOTHING;

DELETE FROM "_RolePermissions"
WHERE "A" IN (
  SELECT "id" FROM "Permission" WHERE "code" IN (
    'ACQUISITION_VIEW', 'ACQUISITION_CREATE', 'ACQUISITION_UPDATE', 'ACQUISITION_APPROVE', 'ACQUISITION_DELETE',
    'STRAP_ACQUISITION_VIEW', 'STRAP_ACQUISITION_CREATE', 'STRAP_ACQUISITION_UPDATE'
  )
);

DELETE FROM "Permission" WHERE "code" IN (
  'ACQUISITION_VIEW', 'ACQUISITION_CREATE', 'ACQUISITION_UPDATE', 'ACQUISITION_APPROVE', 'ACQUISITION_DELETE',
  'STRAP_ACQUISITION_VIEW', 'STRAP_ACQUISITION_CREATE', 'STRAP_ACQUISITION_UPDATE'
);
