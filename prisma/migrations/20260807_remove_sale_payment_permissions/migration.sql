-- SALE must not access Payment data. The scoped Payment migration preserves
-- legacy coarse grants as *_ALL for other roles, so explicitly remove every
-- Payment grant from SALE after that conversion.
DELETE FROM "_RolePermissions" AS role_permission
USING "Role" AS role, "Permission" AS permission
WHERE role_permission."B" = role."id"
  AND role_permission."A" = permission."id"
  AND role."name" = 'SALE'
  AND permission."code" LIKE '%PAYMENT%';
