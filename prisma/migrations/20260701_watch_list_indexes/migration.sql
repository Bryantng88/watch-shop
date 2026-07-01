CREATE INDEX "Watch_saleStage_updatedAt_idx" ON "Watch"("saleStage", "updatedAt");

CREATE INDEX "ProductImage_productId_role_sortOrder_createdAt_idx" ON "ProductImage"("productId", "role", "sortOrder", "createdAt");
