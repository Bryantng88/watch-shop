WITH eligible AS (
  SELECT p.id
  FROM "Product" p
  JOIN "Watch" w ON w."productId" = p.id
  WHERE p.type = 'WATCH'
    AND p.status = 'AVAILABLE'
    AND COALESCE(p.slug, '') <> ''
    AND w."saleStage" = 'READY'
    AND w."stockStage" = 'IN_STOCK'
    AND w."serviceStage" IN ('NOT_REQUIRED', 'DONE')
    AND EXISTS (SELECT 1 FROM "ProductImage" i WHERE i."productId" = p.id AND i."isForStorefront" AND i."fileKey" <> '')
    AND EXISTS (SELECT 1 FROM "WatchReviewState" r WHERE r."watchId" = w.id AND r."targetType" = 'CONTENT' AND r.status = 'APPROVED')
    AND EXISTS (SELECT 1 FROM "WatchReviewState" r WHERE r."watchId" = w.id AND r."targetType" = 'IMAGE' AND r.status = 'APPROVED')
    AND (p."priceVisibility" = 'HIDE' OR EXISTS (SELECT 1 FROM "WatchPrice" wp WHERE wp."watchId" = w.id AND wp."salePrice" > 0))
  ORDER BY p."updatedAt" DESC, p.id DESC
  LIMIT 12
), selected_watches AS (
  SELECT w.id, w."productId" FROM "Watch" w JOIN eligible e ON e.id = w."productId"
), selected_brands AS (
  SELECT DISTINCT p."brandId" AS id FROM "Product" p JOIN eligible e ON e.id = p.id WHERE p."brandId" IS NOT NULL
)
SELECT jsonb_build_object(
  'format', 1,
  'source', 'staging-storefront-sanitized-subset',
  'exportedAt', now(),
  'tables', jsonb_build_object(
    'Brand', COALESCE((SELECT jsonb_agg(to_jsonb(b)) FROM "Brand" b JOIN selected_brands s ON s.id = b.id), '[]'::jsonb),
    'Product', COALESCE((SELECT jsonb_agg(to_jsonb(p) || jsonb_build_object('vendorId', NULL, 'categoryId', NULL)) FROM "Product" p JOIN eligible e ON e.id = p.id), '[]'::jsonb),
    'ProductContent', COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM "ProductContent" x JOIN eligible e ON e.id = x."productId"), '[]'::jsonb),
    'ProductImage', COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM "ProductImage" x JOIN eligible e ON e.id = x."productId" WHERE x."isForStorefront"), '[]'::jsonb),
    'ProductVariant', COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM "ProductVariant" x JOIN eligible e ON e.id = x."productId"), '[]'::jsonb),
    'Watch', COALESCE((SELECT jsonb_agg(to_jsonb(x) || jsonb_build_object('acquisitionId', NULL, 'duplicateConfirmedByUserId', NULL)) FROM "Watch" x JOIN eligible e ON e.id = x."productId"), '[]'::jsonb),
    'WatchContent', COALESCE((SELECT jsonb_agg(to_jsonb(x) || jsonb_build_object('submittedById', NULL, 'reviewedById', NULL, 'publishedById', NULL)) FROM "WatchContent" x JOIN selected_watches w ON w.id = x."watchId"), '[]'::jsonb),
    'WatchPrice', COALESCE((SELECT jsonb_agg(to_jsonb(x) - 'costPrice' - 'serviceCost' - 'landedCost' - 'minPrice' - 'pricingNote') FROM "WatchPrice" x JOIN selected_watches w ON w.id = x."watchId"), '[]'::jsonb),
    'WatchSpecV2', COALESCE((SELECT jsonb_agg(to_jsonb(x)) FROM "WatchSpecV2" x JOIN selected_watches w ON w.id = x."watchId"), '[]'::jsonb),
    'WatchReviewState', COALESCE((SELECT jsonb_agg(to_jsonb(x) || jsonb_build_object('submittedById', NULL, 'reviewedById', NULL, 'reviewNote', NULL)) FROM "WatchReviewState" x JOIN selected_watches w ON w.id = x."watchId"), '[]'::jsonb)
  )
);
