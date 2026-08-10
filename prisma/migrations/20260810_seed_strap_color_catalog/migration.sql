INSERT INTO "StrapCatalogOption" ("id", "kind", "code", "name", "colorHex", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'COLOR', 'BLACK', 'Đen', '#111827', true, 10, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'BROWN', 'Nâu', '#7C4A2D', true, 20, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'DARK_BROWN', 'Nâu đậm', '#4A2C1A', true, 30, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'TAN', 'Nâu vàng', '#C58A52', true, 40, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'NAVY', 'Xanh navy', '#1E3A5F', true, 50, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'BLUE', 'Xanh dương', '#2563EB', true, 60, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'GREEN', 'Xanh lá', '#2F6B4F', true, 70, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'RED', 'Đỏ', '#B91C1C', true, 80, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'BURGUNDY', 'Đỏ burgundy', '#7F1D3A', true, 90, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'WHITE', 'Trắng', '#F8FAFC', true, 100, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'GRAY', 'Xám', '#6B7280', true, 110, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'BEIGE', 'Be', '#D6C3A5', true, 120, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'ORANGE', 'Cam', '#EA580C', true, 130, NOW(), NOW()),
  (gen_random_uuid()::text, 'COLOR', 'YELLOW', 'Vàng', '#EAB308', true, 140, NOW(), NOW())
ON CONFLICT ("kind", "code") DO UPDATE
SET "name" = EXCLUDED."name",
    "colorHex" = EXCLUDED."colorHex",
    "isActive" = true,
    "sortOrder" = EXCLUDED."sortOrder",
    "updatedAt" = NOW();
