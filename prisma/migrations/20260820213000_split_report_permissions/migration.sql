-- Split broad report access into sales and finance capabilities. Legacy
-- REPORT_VIEW grants sales visibility only; finance remains explicit.
INSERT INTO "Permission" ("id", "code", "description")
VALUES
  (gen_random_uuid()::text, 'REPORT_SALES_VIEW', 'Xem báo cáo bán hàng và truy cập'),
  (gen_random_uuid()::text, 'REPORT_FINANCE_VIEW', 'Xem báo cáo tài chính')
ON CONFLICT ("code") DO UPDATE SET "description" = EXCLUDED."description";

-- Preserve existing non-sensitive report access.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT sales_permission."id", role_permission."B"
FROM "_RolePermissions" role_permission
JOIN "Permission" legacy_permission
  ON legacy_permission."id" = role_permission."A"
 AND legacy_permission."code" = 'REPORT_VIEW'
CROSS JOIN "Permission" sales_permission
WHERE sales_permission."code" = 'REPORT_SALES_VIEW'
ON CONFLICT ("A", "B") DO NOTHING;

-- ADMIN remains the only role automatically granted finance reporting.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" permission
CROSS JOIN "Role" role
WHERE permission."code" IN ('REPORT_SALES_VIEW', 'REPORT_FINANCE_VIEW')
  AND role."name" = 'ADMIN'
ON CONFLICT ("A", "B") DO NOTHING;
