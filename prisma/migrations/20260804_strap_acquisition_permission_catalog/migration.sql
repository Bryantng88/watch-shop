INSERT INTO "Permission" ("id", "code", "description")
VALUES
  (gen_random_uuid()::text, 'STRAP_ACQUISITION_VIEW', 'Xem phieu nhap phu kien'),
  (gen_random_uuid()::text, 'STRAP_ACQUISITION_CREATE', 'Tao phieu nhap phu kien'),
  (gen_random_uuid()::text, 'STRAP_ACQUISITION_UPDATE', 'Cap nhat phieu nhap phu kien')
ON CONFLICT ("code") DO UPDATE
SET "description" = EXCLUDED."description";

INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" AS permission
CROSS JOIN "Role" AS role
WHERE permission."code" IN (
  'STRAP_ACQUISITION_VIEW',
  'STRAP_ACQUISITION_CREATE',
  'STRAP_ACQUISITION_UPDATE'
)
AND role."name" = 'ACCESSORY_MANAGER'
ON CONFLICT ("A", "B") DO NOTHING;
