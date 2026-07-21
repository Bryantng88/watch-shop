INSERT INTO "TechnicalDetailCatalog" ("id", "area", "code", "name", "description", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES (
  (gen_random_uuid())::text,
  'MOVEMENT',
  'MOVEMENT_REPLACE_PARTS',
  'Thay linh kiện máy',
  'Thay một hoặc nhiều linh kiện bên trong bộ máy.',
  110,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("code") DO UPDATE SET
  "area" = EXCLUDED."area",
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "sortOrder" = EXCLUDED."sortOrder",
  "isActive" = true,
  "updatedAt" = CURRENT_TIMESTAMP;
