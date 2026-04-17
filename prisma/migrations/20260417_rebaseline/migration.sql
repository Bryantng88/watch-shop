-- CreateEnum
CREATE TYPE "AcquisitionItemKind" AS ENUM ('PRODUCT', 'SERVICE', 'FEE');

-- CreateEnum
CREATE TYPE "AcquisitionItemStatus" AS ENUM ('DRAFT', 'SENT', 'IN_SERVICE', 'RETURNED', 'BILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AcquisitionStatus" AS ENUM ('DRAFT', 'POSTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "AcquisitionType" AS ENUM ('PURCHASE', 'CONSIGNMENT', 'TRADE_IN', 'BUY_BACK');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('INACTIVE', 'ACTIVE', 'HIDDEN', 'RESERVED', 'SOLD', 'HOLD', 'CONSIGNED');

-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "CaseMaterial" AS ENUM ('STAINLESS_STEEL', 'TITANIUM', 'CERAMIC', 'CARBON', 'GOLD', 'PLATINUM', 'SILVER', 'BRASS', 'TWO_TONE', 'OTHER');

-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('ROUND', 'TANK', 'SQUARE', 'SPECIAL', 'OTHER', 'TONNEAU', 'CUSHION', 'OVAL', 'ASYMMETRICAL', 'OCTAGON', 'POLYGON');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ENTRY', 'MID_RANGE', 'LUXURY');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PROCESSING');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENT', 'AMOUNT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN', 'UNISEX');

-- CreateEnum
CREATE TYPE "Glass" AS ENUM ('SAPPHIRE', 'ACRYLIC', 'MINERAL', 'HARDLEX', 'AR_COATED');

-- CreateEnum
CREATE TYPE "GoldColor" AS ENUM ('YELLOW', 'WHITE', 'ROSE');

-- CreateEnum
CREATE TYPE "ImageRole" AS ENUM ('INLINE', 'GALLERY', 'THUMB', 'COVER');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'VOID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('SALE', 'PURCHASE', 'SERVICE', 'ADJUSTMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "LengthLabel" AS ENUM ('L16', 'L17', 'L18', 'L19', 'L20');

-- CreateEnum
CREATE TYPE "MaintenanceEventType" AS ENUM ('ASSIGN_VENDOR', 'CHANGE_VENDOR', 'NOTE', 'COST');

-- CreateEnum
CREATE TYPE "MechanicalPartGroup" AS ENUM ('POWER', 'ESCAPEMENT', 'BALANCE', 'GEAR_TRAIN', 'SETTING', 'CASE_LINK', 'OTHER');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('AUTOMATIC', 'HAND_WOUND', 'QUARTZ', 'SOLAR', 'KINETIC', 'MECHAQUARTZ', 'SPRING_DRIVE', 'HYBRID');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PRODUCT_PRICE_UPDATED', 'PRODUCT_IN_SERVICE', 'PRODUCT_SERVICE_DONE', 'PRODUCT_READY_FOR_POST');

-- CreateEnum
CREATE TYPE "OrderItemKind" AS ENUM ('PRODUCT', 'SERVICE', 'DISCOUNT');

-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('WEB', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'POSTED', 'RESERVED');

-- CreateEnum
CREATE TYPE "OrderVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PartType" AS ENUM ('GLASS', 'RUBBER_GASKET', 'SRAP', 'BUCKLE', 'SPRING_BAR', 'BATTERY', 'MOVEMENT_PART', 'OTHER', 'BEZEL', 'INSERT');

-- CreateEnum
CREATE TYPE "PaymentDirection" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'MOMO', 'CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentPurpose" AS ENUM ('ORDER_DEPOSIT', 'ORDER_REMAIN', 'ORDER_FULL', 'SERVICE_REQUEST', 'MAINTENANCE_COST', 'SERVICE_FEE', 'ACQUISITION_DEPOSIT', 'ACQUISITION_REMAIN', 'ACQUISITION_FULL', 'SHIPMENT_COST');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ORDER', 'SHIPMENT', 'INVOICE', 'ACQUISITION', 'SERVICE', 'OTHER');

-- CreateEnum
CREATE TYPE "PriceVisibility" AS ENUM ('SHOW', 'HIDE');

-- CreateEnum
CREATE TYPE "ProductCategoryScope" AS ENUM ('WATCH', 'WATCH_STRAP', 'ALL');

-- CreateEnum
CREATE TYPE "ProductOpsStage" AS ENUM ('NORMAL', 'IN_SERVICE', 'BLOCKED', 'SOLD');

-- CreateEnum
CREATE TYPE "ProductPriorityLevel" AS ENUM ('NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProductSaleStage" AS ENUM ('NOT_READY', 'READY_TO_POST', 'LIVE', 'HOLD', 'SOLD');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('AVAILABLE', 'IN_SERVICE', 'CONSIGNED_FROM', 'CONSIGNED_TO', 'HOLD', 'SOLD', 'NEED_SERVICE');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('WATCH_STRAP', 'BOX', 'ACCESSORIES', 'SERVICE', 'PARTS', 'WATCH');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'CONVERTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReserveType" AS ENUM ('NONE', 'COD', 'DEPOSIT');

-- CreateEnum
CREATE TYPE "ServiceDetail" AS ENUM ('BASIC', 'OVERHAUL', 'SPA', 'PARTS_CHANGE', 'BATTERY_CHANGE');

-- CreateEnum
CREATE TYPE "ServicePriority" AS ENUM ('NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('DRAFT', 'DIAGNOSING', 'WAIT_APPROVAL', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ServiceScope" AS ENUM ('WITH_PURCHASE', 'CUSTOMER_OWNED', 'INTERNAL');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('WARRANTY', 'PAID');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('DRAFT', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Strap" AS ENUM ('LEATHER', 'BRACELET', 'RUBBER', 'NATO', 'CANVASS', 'SPECIAL');

-- CreateEnum
CREATE TYPE "Tag" AS ENUM ('PRE_OWNED', 'VINTAGE', 'NEW');

-- CreateEnum
CREATE TYPE "TechnicalActionMode" AS ENUM ('NONE', 'INTERNAL', 'VENDOR');

-- CreateEnum
CREATE TYPE "TechnicalAssessmentStatus" AS ENUM ('DRAFT', 'COMPLETED', 'IN_PROGRESS', 'CANCELED');

-- CreateEnum
CREATE TYPE "TechnicalIssueExecutionStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED');

-- CreateEnum
CREATE TYPE "TechnicalIssueType" AS ENUM ('CHECK', 'SERVICE', 'REPAIR', 'REPLACE', 'OBSERVATION');

-- CreateEnum
CREATE TYPE "TechnicalMovementKind" AS ENUM ('UNKNOWN', 'BATTERY', 'MECHANICAL');

-- CreateEnum
CREATE TYPE "TechnicalSectionStatus" AS ENUM ('GOOD', 'ISSUE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "VendorRole" AS ENUM ('SUPPLIER', 'SERVICE', 'BOTH', 'PRIVATE_SELLER');

-- CreateEnum
CREATE TYPE "VendorType" AS ENUM ('IN_HOUSE', 'PARTNER', 'AUTHORIZED', 'OTHER');

-- CreateEnum
CREATE TYPE "OrderFlowType" AS ENUM ('STANDARD', 'QUICK_ORDER');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus_New" AS ENUM ('DRAFT', 'DIAGNOSING', 'WAIT_APPROVAL', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "WatchCaseMaterialFamily" AS ENUM ('STAINLESS_STEEL', 'TITANIUM', 'CERAMIC', 'CARBON', 'GOLD', 'PLATINUM', 'SILVER', 'BRASS', 'OTHER');

-- CreateEnum
CREATE TYPE "WatchGoldColorV2" AS ENUM ('YELLOW', 'WHITE', 'ROSE', 'MIXED');

-- CreateEnum
CREATE TYPE "WatchGoldTreatment" AS ENUM ('SOLID_GOLD', 'CAPPED_GOLD', 'GOLD_PLATED', 'GOLD_VERMEIL', 'GOLD_FILLED');

-- CreateEnum
CREATE TYPE "WatchMaterialProfile" AS ENUM ('SINGLE_MATERIAL', 'BIMETAL', 'COATED', 'OTHER');

-- CreateEnum
CREATE TYPE "ServicePriorityLevel" AS ENUM ('NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "WatchSiteChannel" AS ENUM ('AFFORDABLE', 'LUXURY');

-- CreateTable
CREATE TABLE "Acquisition" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT,
    "customerId" TEXT,
    "type" "AcquisitionType" NOT NULL DEFAULT 'PURCHASE',
    "acquiredAt" TIMESTAMP(3) NOT NULL,
    "cost" DECIMAL(12,2),
    "currency" TEXT,
    "payoutStatus" TEXT,
    "accquisitionStt" "AcquisitionStatus" NOT NULL DEFAULT 'DRAFT',
    "refNo" TEXT,
    "notes" TEXT,
    "condition" TEXT,
    "warrantyUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(6),
    "returnedAt" TIMESTAMP(6),

    CONSTRAINT "Acquisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcquisitionItem" (
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
    "kind" "AcquisitionItemKind" DEFAULT 'PRODUCT',
    "status" "AcquisitionItemStatus" DEFAULT 'DRAFT',
    "description" TEXT,
    "expectedReturnAt" TIMESTAMP(6),
    "returnedAt" TIMESTAMP(6),
    "vendorRmaNo" TEXT,
    "warrantyMonths" INTEGER,
    "serviceRequestId" TEXT,
    "capitalizeToProduct" BOOLEAN DEFAULT true,
    "productType" "ProductType" NOT NULL DEFAULT 'WATCH',
    "productTitle" TEXT NOT NULL,

    CONSTRAINT "AcquisitionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcquisitionSpecJob" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "acquisitionItemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "runAfter" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "priority" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "AcquisitionSpecJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bank" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bankName" TEXT NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "foundedYear" INTEGER,
    "website" TEXT,
    "logoUrl" TEXT,
    "isAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "status" "BrandStatus" NOT NULL DEFAULT 'ACTIVE',
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Complication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" VARCHAR(32),
    "ward" TEXT,
    "city" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT,
    "district" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "type" "InvoiceType" NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
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
CREATE TABLE "InvoiceItem" (
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
CREATE TABLE "MaintenancePart" (
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
CREATE TABLE "MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL DEFAULT 'PAID',
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" "MaintenanceEventType" NOT NULL DEFAULT 'NOTE',
    "prevVendorId" TEXT,
    "prevVendorName" TEXT,
    "paymentId" TEXT,
    "paidAmount" DECIMAL(12,2),
    "paidAt" TIMESTAMPTZ(6),
    "technicianId" TEXT,
    "technicianNameSnap" TEXT,
    "diagnosis" TEXT,
    "workSummary" TEXT,
    "serviceCatalogId" TEXT,
    "processingMode" TEXT,
    "imageFileKey" TEXT,
    "technicalIssueId" TEXT,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MarketSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MechanicalPartCatalog" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" "MechanicalPartGroup" NOT NULL DEFAULT 'OTHER',
    "defaultCost" DECIMAL(12,2),
    "note" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MechanicalPartCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "refNo" TEXT,
    "customerId" TEXT,
    "shipPhone" TEXT NOT NULL,
    "shipAddress" TEXT NOT NULL,
    "shipWard" TEXT,
    "shipCity" TEXT NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "shippingFee" DECIMAL(12,2),
    "status" "OrderStatus" NOT NULL DEFAULT 'DRAFT',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentMethod" "PaymentMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT,
    "notes" TEXT,
    "shipDistrict" TEXT,
    "hasShipment" BOOLEAN NOT NULL,
    "reserveType" "ReserveType",
    "reserveUntil" TIMESTAMPTZ(6),
    "depositRequired" DECIMAL(12,2),
    "depositPaid" DECIMAL(12,2),
    "source" "OrderSource" NOT NULL DEFAULT 'ADMIN',
    "verificationStatus" "OrderVerificationStatus" NOT NULL DEFAULT 'VERIFIED',
    "quick_from_product_id" TEXT,
    "quickFromProductId" TEXT,
    "quickFlowType" "OrderFlowType" NOT NULL DEFAULT 'STANDARD',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "title" TEXT NOT NULL,
    "listPrice" DECIMAL(12,2) NOT NULL,
    "discountType" "DiscountType",
    "discountValue" DECIMAL(12,2),
    "unitPriceAgreed" DECIMAL(12,2) NOT NULL,
    "taxRate" DECIMAL(12,2),
    "quantity" INTEGER NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productType" "ProductType",
    "kind" "OrderItemKind" NOT NULL,
    "serviceCatalogId" TEXT,
    "serviceScope" "ServiceScope",
    "linkedOrderItemId" TEXT,
    "customerItemNote" TEXT,
    "createdFromFlow" "OrderFlowType" NOT NULL DEFAULT 'STANDARD',

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartVariantSpec" (
    "variantId" TEXT NOT NULL,
    "partType" "PartType" NOT NULL,

    CONSTRAINT "PartVariantSpec_pkey" PRIMARY KEY ("variantId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "direction" "PaymentDirection",
    "order_id" TEXT,
    "service_request_id" TEXT,
    "vendor_id" TEXT,
    "acquisition_id" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "purpose" "PaymentPurpose" NOT NULL DEFAULT 'ORDER_FULL',
    "shipment_id" TEXT,
    "type" "PaymentType" NOT NULL DEFAULT 'ORDER',
    "refNo" VARCHAR(30),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "primaryImageUrl" TEXT,
    "type" "ProductType" NOT NULL,
    "priceVisibility" "PriceVisibility" NOT NULL DEFAULT 'SHOW',
    "brandId" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "isStockManaged" BOOLEAN NOT NULL DEFAULT true,
    "maxQtyPerOrder" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "vendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tag" "Tag" NOT NULL DEFAULT 'PRE_OWNED',
    "status" "ProductStatus" NOT NULL DEFAULT 'AVAILABLE',
    "categoryId" TEXT,
    "contentStatus" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "postContent" TEXT,
    "aiPromptUsed" TEXT,
    "aiGeneratedAt" TIMESTAMP(3),
    "sku" TEXT,
    "nickname" TEXT,
    "specStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "storefrontImageKey" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" "ProductCategoryScope" NOT NULL DEFAULT 'ALL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductContent" (
    "productId" TEXT NOT NULL,
    "titleSnapshot" TEXT,
    "brandSnapshot" TEXT,
    "refSnapshot" TEXT,
    "sizeSnapshot" TEXT,
    "movementSnapshot" TEXT,
    "glassSnapshot" TEXT,
    "strapClaspSnapshot" TEXT,
    "modelSnapshot" TEXT,
    "yearSnapshot" TEXT,
    "generatedContent" TEXT,
    "promptNote" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "specBullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ProductContent_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "role" "ImageRole" NOT NULL DEFAULT 'GALLERY',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "forAdmin" BOOLEAN NOT NULL DEFAULT true,
    "forStorefront" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT,
    "name" TEXT,
    "price" DECIMAL(12,2),
    "stockQty" INTEGER NOT NULL DEFAULT 0,
    "isStockManaged" BOOLEAN DEFAULT true,
    "maxQtyPerOrder" INTEGER NOT NULL DEFAULT 99,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "availabilityStatus" "AvailabilityStatus" NOT NULL DEFAULT 'HIDDEN',
    "listPrice" DECIMAL(18,2),
    "discountType" "DiscountType",
    "discountValue" DECIMAL(18,2),
    "salePrice" DECIMAL(18,2),
    "saleStartsAt" TIMESTAMPTZ(6),
    "saleEndsAt" TIMESTAMPTZ(6),
    "costPrice" DECIMAL(18,2),

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "orderId" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "depositAmt" DECIMAL(12,2),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCatalog" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultPrice" DECIMAL(12,2),
    "durationMin" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "detail" "ServiceDetail" NOT NULL,
    "vendorPrice" DECIMAL(12,2),
    "customerPrice" DECIMAL(12,2),
    "internalCost" DECIMAL(12,2),
    "note" TEXT,
    "categoryKey" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ServiceCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL DEFAULT 'PAID',
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
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "warrantyUntil" TIMESTAMP(3),
    "warrantyPolicy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "servicecatalogid" TEXT,
    "refNo" TEXT,
    "scope" "ServiceScope",
    "vendorId" TEXT,
    "vendorNameSnap" TEXT,
    "technicianId" TEXT,
    "technicianNameSnap" TEXT,
    "skuSnapshot" TEXT,
    "primaryImageUrlSnapshot" TEXT,
    "dummy_technical_rel" TEXT,
    "priority" TEXT DEFAULT 'NORMAL',
    "priority_reason" TEXT,
    "priority_source" TEXT,
    "priority_marked_at" TIMESTAMPTZ(6),
    "priorityReason" TEXT,
    "prioritySource" TEXT,
    "priorityMarkedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" TEXT NOT NULL,
    "shipPhone" TEXT,
    "shipAddress" TEXT,
    "shipCity" TEXT,
    "shipDistrict" TEXT,
    "shipWard" TEXT,
    "carrier" TEXT,
    "trackingCode" TEXT,
    "shippingFee" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'VND',
    "shippedAt" TIMESTAMP(6),
    "deliveredAt" TIMESTAMP(6),
    "notes" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ShipmentStatus" NOT NULL DEFAULT 'DRAFT',
    "refNo" TEXT,
    "orderRefNo" TEXT,
    "customerName" TEXT,

    CONSTRAINT "shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrapVariantSpec" (
    "variantId" TEXT NOT NULL,
    "color" TEXT,
    "material" "Strap" NOT NULL DEFAULT 'LEATHER',
    "quickRelease" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lugWidthMM" INTEGER NOT NULL,
    "buckleWidthMM" INTEGER,

    CONSTRAINT "StrapVariantSpec_pkey" PRIMARY KEY ("variantId")
);

-- CreateTable
CREATE TABLE "SupplyCatalog" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT DEFAULT 'pcs',
    "defaultCost" DECIMAL(12,2),
    "note" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplyCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalAssessment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "serviceRequestId" TEXT NOT NULL,
    "movementKind" "TechnicalMovementKind" NOT NULL DEFAULT 'UNKNOWN',
    "preRate" INTEGER,
    "preAmplitude" INTEGER,
    "preBeatError" DECIMAL(8,2),
    "postRate" INTEGER,
    "postAmplitude" INTEGER,
    "postBeatError" DECIMAL(8,2),
    "actionMode" "TechnicalActionMode" NOT NULL DEFAULT 'NONE',
    "vendorId" TEXT,
    "vendorNameSnap" TEXT,
    "conclusion" TEXT,
    "imageFileKey" TEXT,
    "status" "TechnicalAssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "evaluatedById" TEXT,
    "evaluatedByNameSnap" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "movementStatus" "TechnicalSectionStatus" NOT NULL DEFAULT 'GOOD',
    "caseStatus" "TechnicalSectionStatus" NOT NULL DEFAULT 'GOOD',
    "crystalStatus" "TechnicalSectionStatus" NOT NULL DEFAULT 'GOOD',
    "crownStatus" "TechnicalSectionStatus" NOT NULL DEFAULT 'GOOD',
    "payloadJson" JSONB,

    CONSTRAINT "TechnicalAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalIssue" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "assessmentId" TEXT NOT NULL,
    "area" TEXT,
    "issueType" "TechnicalIssueType" NOT NULL DEFAULT 'CHECK',
    "actionMode" "TechnicalActionMode" NOT NULL DEFAULT 'INTERNAL',
    "serviceCatalogId" TEXT,
    "supplyCatalogId" TEXT,
    "note" TEXT,
    "estimatedCost" DECIMAL(12,2),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendorId" TEXT,
    "vendorNameSnap" TEXT,
    "mechanicalPartCatalogId" TEXT,
    "serviceRequestId" TEXT NOT NULL,
    "executionStatus" "TechnicalIssueExecutionStatus" NOT NULL DEFAULT 'OPEN',
    "openedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "actualCost" DECIMAL(18,2),
    "technicianId" TEXT,
    "summary" TEXT,
    "resolutionNote" TEXT,
    "completedByNameSnap" TEXT,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "confirmedAt" TIMESTAMP(6),
    "confirmedById" TEXT,
    "confirmedByNameSnap" TEXT,

    CONSTRAINT "TechnicalIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
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
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "VendorRole" NOT NULL DEFAULT 'SUPPLIER',
    "isAuthorized" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bankName" TEXT,
    "bankAcc" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watch" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "productId" TEXT NOT NULL,
    "legacyVariantId" TEXT,
    "acquisitionId" TEXT,
    "stockState" TEXT,
    "saleState" TEXT,
    "serviceState" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'MEN',
    "siteChannel" "WatchSiteChannel" NOT NULL DEFAULT 'AFFORDABLE',
    "conditionGrade" TEXT,
    "movementType" "MovementType",
    "movementCalibre" TEXT,
    "serialNumber" TEXT,
    "yearText" TEXT,
    "hasBox" BOOLEAN NOT NULL DEFAULT false,
    "hasPapers" BOOLEAN NOT NULL DEFAULT false,
    "attachedStrapId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Watch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchContent" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "watchId" TEXT NOT NULL,
    "titleOverride" TEXT,
    "summary" TEXT,
    "hookText" TEXT,
    "body" TEXT,
    "bulletSpecs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "aiMetaJson" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchMedia" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "watchId" TEXT NOT NULL,
    "legacyProductImageId" TEXT,
    "key" TEXT,
    "url" TEXT,
    "type" TEXT,
    "role" "ImageRole",
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "mime" TEXT,
    "sizeBytes" INTEGER,
    "dominantHex" TEXT,
    "contentHash" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchPrice" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "watchId" TEXT NOT NULL,
    "costPrice" DECIMAL(18,2),
    "serviceCost" DECIMAL(18,2),
    "landedCost" DECIMAL(18,2),
    "listPrice" DECIMAL(18,2),
    "salePrice" DECIMAL(18,2),
    "minPrice" DECIMAL(18,2),
    "pricingNote" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchSpec" (
    "productId" TEXT NOT NULL,
    "model" TEXT,
    "year" TEXT,
    "caseType" "CaseType" DEFAULT 'ROUND',
    "category" "Category"[],
    "gender" "Gender" DEFAULT 'MEN',
    "length" DECIMAL(12,2),
    "width" DECIMAL(12,2),
    "thickness" DECIMAL(12,2),
    "movement" "MovementType" DEFAULT 'AUTOMATIC',
    "caliber" TEXT,
    "caseMaterial" "CaseMaterial" NOT NULL DEFAULT 'STAINLESS_STEEL',
    "goldKarat" INTEGER,
    "goldColor" "GoldColor",
    "caseSize" TEXT,
    "dialColor" TEXT,
    "marketSegmentId" TEXT,
    "strap" "Strap" DEFAULT 'LEATHER',
    "glass" "Glass" DEFAULT 'MINERAL',
    "boxIncluded" BOOLEAN NOT NULL DEFAULT false,
    "bookletIncluded" BOOLEAN NOT NULL DEFAULT false,
    "cardIncluded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sizeCategory" TEXT,
    "ref" TEXT,
    "hasStrap" BOOLEAN NOT NULL DEFAULT false,
    "isServiced" BOOLEAN NOT NULL DEFAULT false,
    "hasClasp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WatchSpec_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "WatchSpecV2" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "watchId" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "referenceNumber" TEXT,
    "nickname" TEXT,
    "caseShape" "CaseType",
    "caseSizeMM" DECIMAL(12,2),
    "lugToLugMM" DECIMAL(12,2),
    "lugWidthMM" DECIMAL(12,2),
    "thicknessMM" DECIMAL(12,2),
    "materialProfile" "WatchMaterialProfile" NOT NULL DEFAULT 'SINGLE_MATERIAL',
    "primaryCaseMaterial" "WatchCaseMaterialFamily" NOT NULL DEFAULT 'STAINLESS_STEEL',
    "secondaryCaseMaterial" "WatchCaseMaterialFamily",
    "goldTreatment" "WatchGoldTreatment",
    "goldColors" "WatchGoldColorV2"[] DEFAULT ARRAY[]::"WatchGoldColorV2"[],
    "goldKarat" SMALLINT,
    "materialNote" TEXT,
    "dialColor" TEXT,
    "dialFinish" TEXT,
    "crystal" "Glass",
    "movementType" "MovementType",
    "calibre" TEXT,
    "powerReserve" TEXT,
    "waterResistance" TEXT,
    "braceletType" "Strap",
    "strapMaterialText" TEXT,
    "buckleType" TEXT,
    "boxIncluded" BOOLEAN NOT NULL DEFAULT false,
    "bookletIncluded" BOOLEAN NOT NULL DEFAULT false,
    "cardIncluded" BOOLEAN NOT NULL DEFAULT false,
    "featuresJson" JSONB,
    "rawSpecJson" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchSpecV2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvalRequests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "sourceModule" TEXT,
    "serviceRequestId" TEXT,
    "technicalAssessmentId" UUID,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "autoApproved" BOOLEAN NOT NULL DEFAULT false,
    "payloadJson" JSONB,
    "reviewNote" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approvalRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_job_control" (
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "batch_size" INTEGER NOT NULL DEFAULT 6,
    "paused_reason" TEXT,
    "metadata" JSONB,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" TEXT,

    CONSTRAINT "system_job_control_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "system_job_run_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "processor_key" TEXT NOT NULL,
    "trigger_source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "processed_count" INTEGER NOT NULL DEFAULT 0,
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "detail" JSONB,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMPTZ(6),

    CONSTRAINT "system_job_run_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicalActionCatalog" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appliesTo" TEXT NOT NULL DEFAULT 'BOTH',
    "groupKey" TEXT NOT NULL DEFAULT 'MOVEMENT',
    "requiresPart" BOOLEAN NOT NULL DEFAULT false,
    "defaultExecutionMode" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technicalActionCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicalAppearanceIssueCatalog" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "code" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "deductionScore" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technicalAppearanceIssueCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicalAssessments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serviceRequestId" TEXT NOT NULL,
    "machineType" TEXT,
    "movementStatus" TEXT,
    "beforeRate" TEXT,
    "beforeAmp" TEXT,
    "beforeErr" TEXT,
    "afterRate" TEXT,
    "afterAmp" TEXT,
    "afterErr" TEXT,
    "appearanceScore" INTEGER NOT NULL DEFAULT 0,
    "caseScore" INTEGER NOT NULL DEFAULT 0,
    "glassScore" INTEGER NOT NULL DEFAULT 0,
    "dialScore" INTEGER NOT NULL DEFAULT 0,
    "caseIssues" JSONB,
    "glassIssues" JSONB,
    "dialIssues" JSONB,
    "caseManualDeduction" INTEGER NOT NULL DEFAULT 0,
    "glassManualDeduction" INTEGER NOT NULL DEFAULT 0,
    "dialManualDeduction" INTEGER NOT NULL DEFAULT 0,
    "caseNote" TEXT,
    "glassNote" TEXT,
    "dialNote" TEXT,
    "crownStatus" TEXT,
    "crownAction" TEXT,
    "crownExecution" TEXT,
    "crownVendorId" TEXT,
    "crownPartId" TEXT,
    "crownCost" INTEGER NOT NULL DEFAULT 0,
    "crownNote" TEXT,
    "movementCost" INTEGER NOT NULL DEFAULT 0,
    "crownCostTotal" INTEGER NOT NULL DEFAULT 0,
    "cosmeticProposalCost" INTEGER NOT NULL DEFAULT 0,
    "totalCost" INTEGER NOT NULL DEFAULT 0,
    "conclusion" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technicalAssessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicalPartCatalog" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appliesTo" TEXT NOT NULL DEFAULT 'BOTH',
    "partGroup" TEXT NOT NULL DEFAULT 'MOVEMENT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technicalPartCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ComplicationToWatchSpec" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ComplicationToWatchSpec_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MarketSegmentToWatchSpec" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MarketSegmentToWatchSpec_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserRoles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserRoles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_RolePermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RolePermissions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Acquisition_customerId_acquiredAt_idx" ON "Acquisition"("customerId", "acquiredAt");

-- CreateIndex
CREATE INDEX "Acquisition_vendorId_acquiredAt_idx" ON "Acquisition"("vendorId", "acquiredAt");

-- CreateIndex
CREATE INDEX "acquisition_returned_idx" ON "Acquisition"("returnedAt");

-- CreateIndex
CREATE INDEX "acquisition_sent_idx" ON "Acquisition"("sentAt");

-- CreateIndex
CREATE INDEX "AcquisitionItem_acquisitionId_idx" ON "AcquisitionItem"("acquisitionId");

-- CreateIndex
CREATE INDEX "AcquisitionItem_variantId_idx" ON "AcquisitionItem"("variantId");

-- CreateIndex
CREATE INDEX "acqitem_serviceRequest_idx" ON "AcquisitionItem"("serviceRequestId");

-- CreateIndex
CREATE INDEX "acqitem_status_idx" ON "AcquisitionItem"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AcquisitionSpecJob_acquisitionItemId_key" ON "AcquisitionSpecJob"("acquisitionItemId");

-- CreateIndex
CREATE INDEX "AcquisitionSpecJob_productId_idx" ON "AcquisitionSpecJob"("productId");

-- CreateIndex
CREATE INDEX "AcquisitionSpecJob_status_createdAt_idx" ON "AcquisitionSpecJob"("status", "createdAt");

-- CreateIndex
CREATE INDEX "idx_acq_spec_job_run_after" ON "AcquisitionSpecJob"("runAfter");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_bankName_key" ON "Bank"("bankName");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_country_idx" ON "Brand"("country");

-- CreateIndex
CREATE INDEX "Brand_status_sortOrder_idx" ON "Brand"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Complication_name_key" ON "Complication"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_code_key" ON "Invoice"("code");

-- CreateIndex
CREATE INDEX "Invoice_acquisitionId_idx" ON "Invoice"("acquisitionId");

-- CreateIndex
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");

-- CreateIndex
CREATE INDEX "Invoice_issuedAt_idx" ON "Invoice"("issuedAt");

-- CreateIndex
CREATE INDEX "Invoice_orderId_idx" ON "Invoice"("orderId");

-- CreateIndex
CREATE INDEX "Invoice_serviceRequestId_idx" ON "Invoice"("serviceRequestId");

-- CreateIndex
CREATE INDEX "Invoice_type_status_idx" ON "Invoice"("type", "status");

-- CreateIndex
CREATE INDEX "Invoice_vendorId_idx" ON "Invoice"("vendorId");

-- CreateIndex
CREATE INDEX "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- CreateIndex
CREATE INDEX "InvoiceItem_variantId_idx" ON "InvoiceItem"("variantId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_productId_idx" ON "MaintenanceRecord"("productId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_serviceCatalogId_idx" ON "MaintenanceRecord"("serviceCatalogId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_serviceRequestId_idx" ON "MaintenanceRecord"("serviceRequestId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_technicalIssueId_idx" ON "MaintenanceRecord"("technicalIssueId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_technicianId_idx" ON "MaintenanceRecord"("technicianId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_variantId_idx" ON "MaintenanceRecord"("variantId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_vendorId_idx" ON "MaintenanceRecord"("vendorId");

-- CreateIndex
CREATE INDEX "idx_maintenance_record_event_type" ON "MaintenanceRecord"("eventType");

-- CreateIndex
CREATE INDEX "idx_maintenance_record_payment_id" ON "MaintenanceRecord"("paymentId");

-- CreateIndex
CREATE INDEX "idx_maintenance_record_technician_id" ON "MaintenanceRecord"("technicianId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketSegment_name_key" ON "MarketSegment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MechanicalPartCatalog_code_key" ON "MechanicalPartCatalog"("code");

-- CreateIndex
CREATE INDEX "MechanicalPartCatalog_group_sortOrder_idx" ON "MechanicalPartCatalog"("group", "sortOrder");

-- CreateIndex
CREATE INDEX "MechanicalPartCatalog_isActive_sortOrder_idx" ON "MechanicalPartCatalog"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "idx_notification_created" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "idx_notification_user_read" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderCode_key" ON "Order"("refNo");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_source_idx" ON "Order"("source");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_verificationStatus_idx" ON "Order"("verificationStatus");

-- CreateIndex
CREATE INDEX "idx_order_quickFlowType" ON "Order"("quickFlowType");

-- CreateIndex
CREATE INDEX "idx_order_quickFromProductId" ON "Order"("quickFromProductId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE INDEX "idx_orderItem_createdFromFlow" ON "OrderItem"("createdFromFlow");

-- CreateIndex
CREATE INDEX "idx_order_item_kind" ON "OrderItem"("kind");

-- CreateIndex
CREATE INDEX "idx_order_item_service_catalog_id" ON "OrderItem"("serviceCatalogId");

-- CreateIndex
CREATE INDEX "idx_orderitem_linked_order_item" ON "OrderItem"("linkedOrderItemId");

-- CreateIndex
CREATE INDEX "idx_orderitem_service_scope" ON "OrderItem"("serviceScope");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_refNo_key" ON "Payment"("refNo");

-- CreateIndex
CREATE INDEX "idx_payment_acquisition" ON "Payment"("acquisition_id");

-- CreateIndex
CREATE INDEX "idx_payment_direction" ON "Payment"("direction");

-- CreateIndex
CREATE INDEX "idx_payment_order" ON "Payment"("order_id");

-- CreateIndex
CREATE INDEX "idx_payment_paidat" ON "Payment"("paidAt");

-- CreateIndex
CREATE INDEX "idx_payment_service_request" ON "Payment"("service_request_id");

-- CreateIndex
CREATE INDEX "idx_payment_type" ON "Payment"("type");

-- CreateIndex
CREATE INDEX "idx_payment_vendor" ON "Payment"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "Product_specStatus_idx" ON "Product"("specStatus");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE INDEX "Product_updatedAt_idx" ON "Product"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_code_key" ON "ProductCategory"("code");

-- CreateIndex
CREATE INDEX "ProductCategory_scope_isActive_sort_idx" ON "ProductCategory"("scope", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "ProductContent_brandSnapshot_idx" ON "ProductContent"("brandSnapshot");

-- CreateIndex
CREATE INDEX "ProductContent_modelSnapshot_idx" ON "ProductContent"("modelSnapshot");

-- CreateIndex
CREATE INDEX "ProductContent_yearSnapshot_idx" ON "ProductContent"("yearSnapshot");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_availabilityStatus_idx" ON "ProductVariant"("availabilityStatus");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE INDEX "ProductVariant_saleStartsAt_saleEndsAt_idx" ON "ProductVariant"("saleStartsAt", "saleEndsAt");

-- CreateIndex
CREATE INDEX "Reservation_productId_idx" ON "Reservation"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCatalog_code_key" ON "ServiceCatalog"("code");

-- CreateIndex
CREATE INDEX "idx_service_catalog_detail" ON "ServiceCatalog"("detail");

-- CreateIndex
CREATE INDEX "ServiceRequest_customerId_idx" ON "ServiceRequest"("customerId");

-- CreateIndex
CREATE INDEX "ServiceRequest_orderItemId_idx" ON "ServiceRequest"("orderItemId");

-- CreateIndex
CREATE INDEX "ServiceRequest_productId_idx" ON "ServiceRequest"("productId");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "ServiceRequest"("status");

-- CreateIndex
CREATE INDEX "ServiceRequest_technicianId_idx" ON "ServiceRequest"("technicianId");

-- CreateIndex
CREATE INDEX "ServiceRequest_variantId_idx" ON "ServiceRequest"("variantId");

-- CreateIndex
CREATE INDEX "idx_serviceRequest_priority" ON "ServiceRequest"("priority", "priorityMarkedAt" DESC);

-- CreateIndex
CREATE INDEX "idx_service_request_order_item_id" ON "ServiceRequest"("orderItemId");

-- CreateIndex
CREATE INDEX "idx_service_request_technician_id" ON "ServiceRequest"("technicianId");

-- CreateIndex
CREATE INDEX "idx_service_request_vendor_id" ON "ServiceRequest"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "shipment_orderid_key" ON "Shipment"("orderId");

-- CreateIndex
CREATE INDEX "StrapVariantSpec_buckleWidthMM_idx" ON "StrapVariantSpec"("buckleWidthMM");

-- CreateIndex
CREATE INDEX "StrapVariantSpec_lugWidthMM_idx" ON "StrapVariantSpec"("lugWidthMM");

-- CreateIndex
CREATE INDEX "StrapVariantSpec_material_idx" ON "StrapVariantSpec"("material");

-- CreateIndex
CREATE UNIQUE INDEX "SupplyCatalog_code_key" ON "SupplyCatalog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalAssessment_serviceRequestId_key" ON "TechnicalAssessment"("serviceRequestId");

-- CreateIndex
CREATE INDEX "TechnicalIssue_assessmentId_idx" ON "TechnicalIssue"("assessmentId");

-- CreateIndex
CREATE INDEX "TechnicalIssue_executionStatus_idx" ON "TechnicalIssue"("executionStatus");

-- CreateIndex
CREATE INDEX "TechnicalIssue_isConfirmed_idx" ON "TechnicalIssue"("isConfirmed");

-- CreateIndex
CREATE INDEX "TechnicalIssue_mechanicalPartCatalogId_idx" ON "TechnicalIssue"("mechanicalPartCatalogId");

-- CreateIndex
CREATE INDEX "TechnicalIssue_serviceRequestId_idx" ON "TechnicalIssue"("serviceRequestId");

-- CreateIndex
CREATE INDEX "TechnicalIssue_technicianId_idx" ON "TechnicalIssue"("technicianId");

-- CreateIndex
CREATE INDEX "TechnicalIssue_vendorId_idx" ON "TechnicalIssue"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE INDEX "Vendor_role_idx" ON "Vendor"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_role_key" ON "Vendor"("name", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Watch_productId_key" ON "Watch"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Watch_legacyVariantId_key" ON "Watch"("legacyVariantId");

-- CreateIndex
CREATE INDEX "Watch_gender_idx" ON "Watch"("gender");

-- CreateIndex
CREATE INDEX "Watch_saleState_idx" ON "Watch"("saleState");

-- CreateIndex
CREATE INDEX "Watch_serviceState_idx" ON "Watch"("serviceState");

-- CreateIndex
CREATE INDEX "Watch_siteChannel_idx" ON "Watch"("siteChannel");

-- CreateIndex
CREATE UNIQUE INDEX "WatchContent_watchId_key" ON "WatchContent"("watchId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchMedia_legacyProductImageId_key" ON "WatchMedia"("legacyProductImageId");

-- CreateIndex
CREATE INDEX "WatchMedia_watchId_sortOrder_idx" ON "WatchMedia"("watchId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "WatchPrice_watchId_key" ON "WatchPrice"("watchId");

-- CreateIndex
CREATE INDEX "WatchPrice_salePrice_idx" ON "WatchPrice"("salePrice");

-- CreateIndex
CREATE UNIQUE INDEX "WatchSpecV2_watchId_key" ON "WatchSpecV2"("watchId");

-- CreateIndex
CREATE INDEX "WatchSpecV2_caseShape_idx" ON "WatchSpecV2"("caseShape");

-- CreateIndex
CREATE INDEX "WatchSpecV2_goldTreatment_idx" ON "WatchSpecV2"("goldTreatment");

-- CreateIndex
CREATE INDEX "WatchSpecV2_primaryCaseMaterial_idx" ON "WatchSpecV2"("primaryCaseMaterial");

-- CreateIndex
CREATE INDEX "WatchSpecV2_secondaryCaseMaterial_idx" ON "WatchSpecV2"("secondaryCaseMaterial");

-- CreateIndex
CREATE INDEX "idx_approvalrequests_servicerequestid" ON "approvalRequests"("serviceRequestId");

-- CreateIndex
CREATE INDEX "idx_approvalrequests_taid" ON "approvalRequests"("technicalAssessmentId");

-- CreateIndex
CREATE INDEX "idx_system_job_run_log_processor_key" ON "system_job_run_log"("processor_key");

-- CreateIndex
CREATE INDEX "idx_system_job_run_log_started_at" ON "system_job_run_log"("started_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "technicalActionCatalog_code_key" ON "technicalActionCatalog"("code");

-- CreateIndex
CREATE INDEX "technicalActionCatalog_active_idx" ON "technicalActionCatalog"("isActive", "groupKey", "appliesTo", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "technicalAppearanceIssueCatalog_code_key" ON "technicalAppearanceIssueCatalog"("code");

-- CreateIndex
CREATE INDEX "technicalAppearanceIssueCatalog_active_idx" ON "technicalAppearanceIssueCatalog"("isActive", "area", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "technicalAssessments_serviceRequestId_key" ON "technicalAssessments"("serviceRequestId");

-- CreateIndex
CREATE INDEX "idx_technicalassessments_servicerequestid" ON "technicalAssessments"("serviceRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "technicalPartCatalog_code_key" ON "technicalPartCatalog"("code");

-- CreateIndex
CREATE INDEX "technicalPartCatalog_active_idx" ON "technicalPartCatalog"("isActive", "partGroup", "appliesTo", "sortOrder");

-- CreateIndex
CREATE INDEX "_ComplicationToWatchSpec_B_index" ON "_ComplicationToWatchSpec"("B");

-- CreateIndex
CREATE INDEX "_MarketSegmentToWatchSpec_B_index" ON "_MarketSegmentToWatchSpec"("B");

-- CreateIndex
CREATE INDEX "_UserRoles_B_index" ON "_UserRoles"("B");

-- CreateIndex
CREATE INDEX "_RolePermissions_B_index" ON "_RolePermissions"("B");

-- AddForeignKey
ALTER TABLE "Acquisition" ADD CONSTRAINT "Acquisition_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acquisition" ADD CONSTRAINT "Acquisition_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_acquisitionId_fkey" FOREIGN KEY ("acquisitionId") REFERENCES "Acquisition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_sourceOrderItemId_fkey" FOREIGN KEY ("sourceOrderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionItem" ADD CONSTRAINT "AcquisitionItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionSpecJob" ADD CONSTRAINT "AcquisitionSpecJob_acquisitionItemId_fkey" FOREIGN KEY ("acquisitionItemId") REFERENCES "AcquisitionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionSpecJob" ADD CONSTRAINT "AcquisitionSpecJob_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_acquisitionId_fkey" FOREIGN KEY ("acquisitionId") REFERENCES "Acquisition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceItem" ADD CONSTRAINT "InvoiceItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenancePart" ADD CONSTRAINT "MaintenancePart_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MaintenanceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenancePart" ADD CONSTRAINT "MaintenancePart_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_serviceCatalogId_fkey" FOREIGN KEY ("serviceCatalogId") REFERENCES "ServiceCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_technicalIssueId_fkey" FOREIGN KEY ("technicalIssueId") REFERENCES "TechnicalIssue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "fk_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_linkedOrderItemId_fkey" FOREIGN KEY ("linkedOrderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "fk_order_items_service_catalog" FOREIGN KEY ("serviceCatalogId") REFERENCES "ServiceCatalog"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PartVariantSpec" ADD CONSTRAINT "PartVariantSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductContent" ADD CONSTRAINT "ProductContent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "fk_service_requests_service_catalog" FOREIGN KEY ("servicecatalogid") REFERENCES "ServiceCatalog"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "fk_shipment_order" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "StrapVariantSpec" ADD CONSTRAINT "StrapVariantSpec_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalAssessment" ADD CONSTRAINT "TechnicalAssessment_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalAssessment" ADD CONSTRAINT "TechnicalAssessment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalIssue" ADD CONSTRAINT "TechnicalIssue_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "TechnicalAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalIssue" ADD CONSTRAINT "TechnicalIssue_mechanicalPartCatalogId_fkey" FOREIGN KEY ("mechanicalPartCatalogId") REFERENCES "MechanicalPartCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalIssue" ADD CONSTRAINT "TechnicalIssue_serviceCatalogId_fkey" FOREIGN KEY ("serviceCatalogId") REFERENCES "ServiceCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalIssue" ADD CONSTRAINT "TechnicalIssue_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalIssue" ADD CONSTRAINT "TechnicalIssue_supplyCatalogId_fkey" FOREIGN KEY ("supplyCatalogId") REFERENCES "SupplyCatalog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalIssue" ADD CONSTRAINT "TechnicalIssue_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalIssue" ADD CONSTRAINT "TechnicalIssue_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_bankName_fkey" FOREIGN KEY ("bankName") REFERENCES "Bank"("bankName") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WatchContent" ADD CONSTRAINT "WatchContent_watchId_fkey" FOREIGN KEY ("watchId") REFERENCES "Watch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WatchMedia" ADD CONSTRAINT "WatchMedia_watchId_fkey" FOREIGN KEY ("watchId") REFERENCES "Watch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WatchPrice" ADD CONSTRAINT "WatchPrice_watchId_fkey" FOREIGN KEY ("watchId") REFERENCES "Watch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "WatchSpec" ADD CONSTRAINT "WatchSpec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchSpecV2" ADD CONSTRAINT "WatchSpecV2_watchId_fkey" FOREIGN KEY ("watchId") REFERENCES "Watch"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "approvalRequests" ADD CONSTRAINT "fk_approvalrequests_ta" FOREIGN KEY ("technicalAssessmentId") REFERENCES "technicalAssessments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_ComplicationToWatchSpec" ADD CONSTRAINT "_ComplicationToWatchSpec_A_fkey" FOREIGN KEY ("A") REFERENCES "Complication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ComplicationToWatchSpec" ADD CONSTRAINT "_ComplicationToWatchSpec_B_fkey" FOREIGN KEY ("B") REFERENCES "WatchSpec"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketSegmentToWatchSpec" ADD CONSTRAINT "_MarketSegmentToWatchSpec_A_fkey" FOREIGN KEY ("A") REFERENCES "MarketSegment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MarketSegmentToWatchSpec" ADD CONSTRAINT "_MarketSegmentToWatchSpec_B_fkey" FOREIGN KEY ("B") REFERENCES "WatchSpec"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRoles" ADD CONSTRAINT "_UserRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRoles" ADD CONSTRAINT "_UserRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolePermissions" ADD CONSTRAINT "_RolePermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

