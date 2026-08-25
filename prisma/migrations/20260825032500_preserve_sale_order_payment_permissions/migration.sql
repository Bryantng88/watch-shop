-- SALE owns the customer-facing Order payment workflow. Preserve its scoped
-- Order payment capabilities and grant the sales report introduced later.
-- This intentionally does not grant Acquisition, Service, Shipment, or *_ALL
-- payment permissions.
INSERT INTO "_RolePermissions" ("A", "B")
SELECT permission."id", role."id"
FROM "Permission" AS permission
CROSS JOIN "Role" AS role
WHERE role."name" = 'SALE'
  AND permission."code" IN (
    'REPORT_SALES_VIEW',
    'ORDER_PAYMENT_VIEW',
    'ORDER_PAYMENT_CREATE',
    'ORDER_PAYMENT_UPDATE',
    'ORDER_PAYMENT_DELETE'
  )
ON CONFLICT ("A", "B") DO NOTHING;
