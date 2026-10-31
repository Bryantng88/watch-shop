-- Do not silently narrow an independently configured role with the same name.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "Role" r
    JOIN "_RolePermissions" rp ON rp."B" = r.id
    JOIN "Permission" p ON p.id = rp."A"
    WHERE r.name = 'MEDIA'
      AND p.code NOT IN ('PRODUCT_VIEW', 'MEDIA_PRODUCTION_VIEW', 'MEDIA_PRODUCTION_UPDATE')
  ) THEN
    RAISE EXCEPTION 'MEDIA_ROLE_PERMISSION_CONFLICT: review existing MEDIA role before rollout';
  END IF;
END $$;

INSERT INTO "Permission" (id, code, description) VALUES
  (gen_random_uuid()::text, 'MEDIA_PRODUCTION_VIEW', 'Xem luong san xuat media va bai post'),
  (gen_random_uuid()::text, 'MEDIA_PRODUCTION_UPDATE', 'Tao bai post, xu ly media va cap nhat tien do san xuat')
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description;

INSERT INTO "Role" (id, name, description)
VALUES (gen_random_uuid()::text, 'MEDIA', 'San xuat media va xem san pham; khong co quyen kinh doanh hay quan tri')
ON CONFLICT (name) DO NOTHING;

INSERT INTO "_RolePermissions" ("A", "B")
SELECT p.id, r.id FROM "Permission" p CROSS JOIN "Role" r
WHERE (r.name = 'MEDIA' AND p.code IN ('PRODUCT_VIEW', 'MEDIA_PRODUCTION_VIEW', 'MEDIA_PRODUCTION_UPDATE'))
   OR (r.name = 'ADMIN' AND p.code IN ('MEDIA_PRODUCTION_VIEW', 'MEDIA_PRODUCTION_UPDATE'))
ON CONFLICT ("A", "B") DO NOTHING;
