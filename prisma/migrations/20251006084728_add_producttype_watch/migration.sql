-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('ENTRY', 'MID_RANGE', 'LUXURY');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'STAFF', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."ProductType" AS ENUM ('WATCH_STRAP', 'BOX', 'ACCESSORIES', 'SERVICE', 'PARTS', 'WATCH');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ServiceRequestStatus" AS ENUM ('PENDING', 'DIAGNOSING', 'WAIT_APPROVAL', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."ServicePriority" AS ENUM ('NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."ServiceDetail" AS ENUM ('BASIC', 'OVERHAUL', 'SPA', 'PARTS_CHANGE', 'BATTERY_CHANGE');

-- CreateEnum
CREATE TYPE "public"."ServiceType" AS ENUM ('WARRANTY', 'PAID');

-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('ACTIVE', 'HOLD', 'SOLD', 'CONSIGNED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MEN', 'WOMEN', 'UNISEX');

-- CreateEnum
CREATE TYPE "public"."Glass" AS ENUM ('SAPPHIRE', 'ACRYLIC', 'MINERAL', 'HARDLEX', 'AR_COATED');

-- CreateEnum
CREATE TYPE "public"."ImageRole" AS ENUM ('PRIMARY', 'GALLERY', 'THUMB', 'COVER');

-- CreateEnum
CREATE TYPE "public"."BrandStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "public"."CaseType" AS ENUM ('ROUND', 'TANK', 'SQUARE', 'SPECIAL', 'OTHER', 'TONNEAU', 'CUSHION', 'OVAL', 'ASYMMETRICAL', 'OCTAGON', 'POLYGON');

-- CreateEnum
CREATE TYPE "public"."Strap" AS ENUM ('LEATHER', 'BRACELET', 'RUBBER', 'NATO', 'CANVASS', 'SPECIAL');

-- CreateEnum
CREATE TYPE "public"."VendorRole" AS ENUM ('SUPPLIER', 'SERVICE', 'BOTH', 'PRIVATE_SELLER');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('COD', 'MOMO', 'CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH');

-- CreateEnum
CREATE TYPE "public"."InvoiceType" AS ENUM ('SALE', 'PURCHASE', 'SERVICE', 'ADJUSTMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'VOID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."MovementType" AS ENUM ('AUTOMATIC', 'HAND_WOUND', 'QUARTZ', 'SOLAR', 'KINETIC', 'MECHAQUARTZ', 'SPRING_DRIVE', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."CaseMaterial" AS ENUM ('STAINLESS_STEEL', 'TITANIUM', 'CERAMIC', 'CARBON', 'GOLD', 'PLATINUM', 'SILVER', 'BRASS', 'TWO_TONE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PartType" AS ENUM ('GLASS', 'RUBBER_GASKET', 'SRAP', 'BUCKLE', 'SPRING_BAR', 'BATTERY', 'MOVEMENT_PART', 'OTHER', 'BEZEL', 'INSERT');

-- CreateEnum
CREATE TYPE "public"."GoldColor" AS ENUM ('YELLOW', 'WHITE', 'ROSE');

-- CreateEnum
CREATE TYPE "public"."LengthLabel" AS ENUM ('L16', 'L17', 'L18', 'L19', 'L20');

-- CreateEnum
CREATE TYPE "public"."VendorType" AS ENUM ('IN_HOUSE', 'PARTNER', 'AUTHORIZED', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."AcquisitionType" AS ENUM ('PURCHASE', 'CONSIGNMENT', 'TRADE_IN', 'BUY_BACK');

-- CreateTable
CREATE TABLE "public"."MarketSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MarketSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Complication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Complication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "foundedYear" INTEGER,
    "website" TEXT,
    "logoUrl" TEXT,
    "isAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."BrandStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "role" "public"."ImageRole" NOT NULL DEFAULT 'GALLERY',
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "mime" TEXT,
    "sizeBytes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "dominantHex" TEXT,
    "contentHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "public"."ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "primaryImageUrl" TEXT,
    "type" "public"."ProductType" NOT NULL,
    "brandId" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "isStockManaged" BOOLEAN NOT NULL DEFAULT true,
    "maxQtyPerOrder" INTEGER NOT NULL DEFAULT 99,
    "publishedAt" TIMESTAMP(3),
    "vendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT,
    "price" DECIMAL(12,2),
    "stockQty" INTEGER NOT NULL DEFAULT 0,
    "isStockManaged" BOOLEAN DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxQtyPerOrder" INTEGER NOT NULL DEFAULT 99,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartVariantSpec" (
    "variantId" TEXT NOT NULL,
    "partType" "public"."PartType" NOT NULL,

    CONSTRAINT "PartVariantSpec_pkey" PRIMARY KEY ("variantId")
);

-- CreateTable
CREATE TABLE "public"."WatchSpec" (
    "productId" TEXT NOT NULL,
    "model" TEXT,
    "year" TEXT,
    "caseType" "public"."CaseType" NOT NULL DEFAULT 'ROUND',
    "category" "public"."Category"[],
    "gender" "public"."Gender" NOT NULL DEFAULT 'MEN',
    "length" DECIMAL(12,2) NOT NULL,
    "width" DECIMAL(12,2) NOT NULL,
    "thickness" DECIMAL(12,2) NOT NULL,
    "movement" "public"."MovementType" NOT NULL DEFAULT 'AUTOMATIC',
    "caliber" TEXT,
    "caseMaterial" "public"."CaseMaterial" NOT NULL DEFAULT 'STAINLESS_STEEL',
    "goldKarat" INTEGER,
    "goldColor" "public"."GoldColor",
    "caseSize" TEXT,
    "dialColor" TEXT,
    "marketSegmentId" TEXT,
    "strap" "public"."Strap" NOT NULL DEFAULT 'LEATHER',
    "glass" "public"."Glass" NOT NULL DEFAULT 'MINERAL',
    "boxIncluded" BOOLEAN NOT NULL DEFAULT false,
    "bookletIncluded" BOOLEAN NOT NULL DEFAULT false,
    "cardIncluded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchSpec_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "public"."StrapVariantSpec" (
    "variantId" TEXT NOT NULL,
    "widthMM" INTEGER NOT NULL,
    "lengthLabel" "public"."LengthLabel",
    "color" TEXT,
    "material" "public"."Strap" NOT NULL DEFAULT 'LEATHER',
    "quickRelease" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrapVariantSpec_pkey" PRIMARY KEY ("variantId")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "orderCode" TEXT NOT NULL,
    "customerId" TEXT,
    "shipName" TEXT NOT NULL,
    "shipPhone" TEXT NOT NULL,
    "shipEmail" TEXT NOT NULL,
    "shipAddress" TEXT NOT NULL,
    "shipWard" TEXT,
    "shipCity" TEXT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "shippingFee" DECIMAL(12,2),
    "total" DECIMAL(12,2) NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" "public"."PaymentMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "title" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceCatalog" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultPrice" DECIMAL(12,2),
    "durationMin" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "maintenanceRecordId" TEXT,

    CONSTRAINT "ServiceCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceRequest" (
    "id" TEXT NOT NULL,
    "type" "public"."ServiceType" NOT NULL DEFAULT 'PAID',
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "orderItemId" TEXT,
    "customerId" TEXT,
    "productId" TEXT,
    "variantId" TEXT,
    "brandSnapshot" TEXT,
    "modelSnapshot" TEXT,
    "refSnapshot" TEXT,
    "serialSnapshot" TEXT,
    "appointmentAt" TIMESTAMP(3),
    "status" "public"."ServiceRequestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "warrantyUntil" TIMESTAMP(3),
    "warrantyPolicy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "type" "public"."ServiceType" NOT NULL DEFAULT 'PAID',
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "serviceRequestId" TEXT,
    "productId" TEXT,
    "variantId" TEXT,
    "brandSnapshot" TEXT,
    "modelSnapshot" TEXT,
    "refSnapshot" TEXT,
    "serialSnapshot" TEXT,
    "vendorId" TEXT,
    "servicedByName" TEXT,
    "vendorName" TEXT,
    "servicedAt" TIMESTAMP(3),
    "notes" TEXT,
    "totalCost" DECIMAL(12,2),
    "billed" BOOLEAN NOT NULL DEFAULT false,
    "invoiceId" TEXT,
    "revenueAmount" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'VND',

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MaintenancePart" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "variantId" TEXT,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(12,2),
    "notes" TEXT,

    CONSTRAINT "MaintenancePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."VendorRole" NOT NULL DEFAULT 'SUPPLIER',
    "isAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Acquisition" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT,
    "customerId" TEXT,
    "type" "public"."AcquisitionType" NOT NULL DEFAULT 'PURCHASE',
    "acquiredAt" TIMESTAMP(3) NOT NULL,
    "cost" DECIMAL(12,2),
    "currency" TEXT,
    "payoutStatus" TEXT,
    "refNo" TEXT,
    "notes" TEXT,
    "condition" TEXT,
    "warrantyUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Acquisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AcquisitionItem" (
    "id" TEXT NOT NULL,
    "acquisitionId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCost" DECIMAL(12,2),
    "currency" TEXT,
    "notes" TEXT,
    "sourceOrderItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcquisitionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roleId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" VARCHAR(32),
    "ward" TEXT,
    "city" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Invoice" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "type" "public"."InvoiceType" NOT NULL,
    "status" "public"."InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "customerId" TEXT,
    "vendorId" TEXT,
    "orderId" TEXT,
    "acquisitionId" TEXT,
    "serviceRequestId" TEXT,
    "currency" TEXT NOT NULL,
    "subTotal" DECIMAL(12,2) NOT NULL,
    "taxTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountTotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL(12,2) NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InvoiceItem" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "method" "public"."PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MarketSegmentToWatchSpec" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MarketSegmentToWatchSpec_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ComplicationToWatchSpec" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ComplicationToWatchSpec_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_UserRoles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_RolePermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RolePermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketSegment_name_key" ON "public"."MarketSegment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Complication_name_key" ON "public"."Complication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "public"."Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "public"."Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_country_idx" ON "public"."Brand"("country");

-- CreateIndex
CREATE INDEX "Brand_status_sortOrder_idx" ON "public"."Brand"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "public"."Product"("status");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "public"."Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "public"."Product"("type");

-- CreateIndex
CREATE INDEX "Product_status_type_publishedAt_idx" ON "public"."Product"("status", "type", "publishedAt");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "public"."Product"("createdAt");

-- CreateIndex
CREATE INDEX "Product_updatedAt_idx" ON "public"."Product"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "public"."ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "public"."ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_isActive_idx" ON "public"."ProductVariant"("isActive");

-- CreateIndex
CREATE INDEX "StrapVariantSpec_widthMM_idx" ON "public"."StrapVariantSpec"("widthMM");

-- CreateIndex
CREATE INDEX "StrapVariantSpec_material_idx" ON "public"."StrapVariantSpec"("material");

-- CreateIndex
CREATE INDEX "StrapVariantSpec_lengthLabel_idx" ON "public"."StrapVariantSpec"("lengthLabel");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderCode_key" ON "public"."Order"("orderCode");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "public"."Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "public"."Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "public"."OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "public"."OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCatalog_code_key" ON "public"."ServiceCatalog"("code");

-- CreateIndex
CREATE INDEX "ServiceRequest_customerId_idx" ON "public"."ServiceRequest"("customerId");

-- CreateIndex
CREATE INDEX "ServiceRequest_productId_idx" ON "public"."ServiceRequest"("productId");

-- CreateIndex
CREATE INDEX "ServiceRequest_variantId_idx" ON "public"."ServiceRequest"("variantId");

-- CreateIndex
CREATE INDEX "ServiceRequest_orderItemId_idx" ON "public"."ServiceRequest"("orderItemId");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "public"."ServiceRequest"("status");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_serviceRequestId_idx" ON "public"."MaintenanceRecord"("serviceRequestId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_productId_idx" ON "public"."MaintenanceRecord"("productId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_variantId_idx" ON "public"."MaintenanceRecord"("variantId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_vendorId_idx" ON "public"."MaintenanceRecord"("vendorId");

-- CreateIndex
CREATE INDEX "Vendor_role_idx" ON "public"."Vendor"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_role_key" ON "public"."Vendor"("name", "role");

-- CreateIndex
CREATE INDEX "Acquisition_vendorId_acquiredAt_idx" ON "public"."Acquisition"("vendorId", "acquiredAt");

-- CreateIndex
CREATE INDEX "Acquisition_customerId_acquiredAt_idx" ON "public"."Acquisition"("customerId", "acquiredAt");

-- CreateIndex
CREATE INDEX "AcquisitionItem_acquisitionId_idx" ON "public"."AcquisitionItem"("acquisitionId");

-- CreateIndex
CREATE INDEX "AcquisitionItem_variantId_idx" ON "public"."AcquisitionItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "public"."User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "public"."Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "public"."Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "public"."Customer"("userId");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "public"."Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_code_key" ON "public"."Invoice"("code");

-- CreateIndex
CREATE INDEX "Invoice_type_status_idx" ON "public"."Invoice"("type", "status");

-- CreateIndex
CREATE INDEX "Invoice_customerId_idx" ON "public"."Invoice"("customerId");

-- CreateIndex
CREATE INDEX "Invoice_vendorId_idx" ON "public"."Invoice"("vendorId");

-- CreateIndex
CREATE INDEX "Invoice_issuedAt_idx" ON "public"."Invoice"("issuedAt");

-- CreateIndex
CREATE INDEX "Invoice_orderId_idx" ON "public"."Invoice"("orderId");

-- CreateIndex
CREATE INDEX "Invoice_acquisitionId_idx" ON "public"."Invoice"("acquisitionId");

-- CreateIndex
CREATE INDEX "Invoice_serviceRequestId_idx" ON "public"."Invoice"("serviceRequestId");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "public"."InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceItem_variantId_idx" ON "public"."InvoiceItem"("variantId");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_paidAt_idx" ON "public"."Payment"("invoiceId", "paidAt");

-- CreateIndex
CREATE INDEX "_MarketSegmentToWatchSpec_B_index" ON "public"."_MarketSegmentToWatchSpec"("B");

-- CreateIndex
CREATE INDEX "_ComplicationToWatchSpec_B_index" ON "public"."_ComplicationToWatchSpec"("B");

-- CreateIndex
CREATE INDEX "_UserRoles_B_index" ON "public"."_UserRoles"("B");

-- CreateIndex
CREATE INDEX "_RolePermissions_B_index" ON "public"."_RolePermissions"("B");

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartVariantSpec" ADD CONSTRAINT "PartVariantSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WatchSpec" ADD CONSTRAINT "WatchSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StrapVariantSpec" ADD CONSTRAINT "StrapVariantSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceCatalog" ADD CONSTRAINT "ServiceCatalog_maintenanceRecordId_fkey" FOREIGN KEY ("maintenanceRecordId") REFERENCES "public"."MaintenanceRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceRequest" ADD CONSTRAINT "ServiceRequest_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "public"."ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenancePart" ADD CONSTRAINT "MaintenancePart_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "public"."MaintenanceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenancePart" ADD CONSTRAINT "MaintenancePart_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Acquisition" ADD CONSTRAINT "Acquisition_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Acquisition" ADD CONSTRAINT "Acquisition_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_acquisitionId_fkey" FOREIGN KEY ("acquisitionId") REFERENCES "public"."Acquisition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_sourceOrderItemId_fkey" FOREIGN KEY ("sourceOrderItemId") REFERENCES "public"."OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_acquisitionId_fkey" FOREIGN KEY ("acquisitionId") REFERENCES "public"."Acquisition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "public"."ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceItem" ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceItem" ADD CONSTRAINT "InvoiceItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MarketSegmentToWatchSpec" ADD CONSTRAINT "_MarketSegmentToWatchSpec_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."MarketSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MarketSegmentToWatchSpec" ADD CONSTRAINT "_MarketSegmentToWatchSpec_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."WatchSpec"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ComplicationToWatchSpec" ADD CONSTRAINT "_ComplicationToWatchSpec_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Complication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ComplicationToWatchSpec" ADD CONSTRAINT "_ComplicationToWatchSpec_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."WatchSpec"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserRoles" ADD CONSTRAINT "_UserRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserRoles" ADD CONSTRAINT "_UserRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RolePermissions" ADD CONSTRAINT "_RolePermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RolePermissions" ADD CONSTRAINT "_RolePermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
