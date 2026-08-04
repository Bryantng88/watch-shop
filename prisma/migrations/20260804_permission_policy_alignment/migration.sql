-- Align SALE_ADMIN with the production payment workflow and the authorization
-- policy enforced by admin pages, API routes and server actions.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" AS permission
CROSS JOIN "Role" AS role
WHERE permission."code" IN (
  'TASK_VIEW',
  'PAYMENT_VIEW',
  'PAYMENT_CREATE',
  'PAYMENT_UPDATE',
  'PRODUCT_COST_VIEW',
  'ACTIVITY_READ',
  'ACTIVITY_EDIT'
)
AND role."name" = 'SALE_ADMIN'
ON CONFLICT ("A", "B") DO NOTHING;

-- Invoice runtime paths are retired. Remove obsolete permission metadata while
-- preserving all Invoice business data and schema objects.
DELETE FROM "_RolePermissions"
WHERE "A" IN (
  SELECT "id"
  FROM "Permission"
  WHERE "code" IN ('INVOICE_VIEW', 'INVOICE_CREATE', 'INVOICE_UPDATE', 'INVOICE_DELETE')
);

DELETE FROM "Permission"
WHERE "code" IN ('INVOICE_VIEW', 'INVOICE_CREATE', 'INVOICE_UPDATE', 'INVOICE_DELETE');
