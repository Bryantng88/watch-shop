INSERT INTO "Permission" ("id", "code", "description")
VALUES
  (gen_random_uuid()::text, 'ACTIVITY_READ', 'Xem Activity và trao đổi nghiệp vụ'),
  (gen_random_uuid()::text, 'ACTIVITY_EDIT', 'Tạo trao đổi và phản hồi Activity')
ON CONFLICT ("code") DO UPDATE
SET "description" = EXCLUDED."description";

INSERT INTO "_RolePermissions" ("A", "B")
SELECT activity_permission."id", task_view_role."B"
FROM "Permission" AS activity_permission
CROSS JOIN (
  SELECT role_permission."B"
  FROM "_RolePermissions" AS role_permission
  INNER JOIN "Permission" AS task_view_permission
    ON task_view_permission."id" = role_permission."A"
  WHERE task_view_permission."code" = 'TASK_VIEW'
) AS task_view_role
WHERE activity_permission."code" IN ('ACTIVITY_READ', 'ACTIVITY_EDIT')
ON CONFLICT ("A", "B") DO NOTHING;
