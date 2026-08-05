-- ADMIN is a system role with the complete permission catalog. Keep the
-- persisted relation in sync as well so the role editor accurately shows the
-- same full access that runtime authorization grants to ADMIN.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" permission
CROSS JOIN "Role" role
WHERE role."name" = 'ADMIN'
ON CONFLICT ("A", "B") DO NOTHING;
