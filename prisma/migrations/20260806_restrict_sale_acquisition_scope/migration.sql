-- SALE may only view and create accessory acquisitions. Remove permissions
-- inherited from the former unscoped acquisition catalog migration.
DELETE FROM "_RolePermissions" role_permission
USING "Role" role, "Permission" permission
WHERE role_permission."B" = role."id"
  AND role_permission."A" = permission."id"
  AND role."name" = 'SALE'
  AND permission."code" LIKE '%ACQUISITION%'
  AND permission."code" NOT IN (
    'ACCESSORY_ACQUISITION_VIEW',
    'ACCESSORY_ACQUISITION_CREATE'
  );

INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" permission
CROSS JOIN "Role" role
WHERE role."name" = 'SALE'
  AND permission."code" IN (
    'ACCESSORY_ACQUISITION_VIEW',
    'ACCESSORY_ACQUISITION_CREATE'
  )
ON CONFLICT ("A", "B") DO NOTHING;
