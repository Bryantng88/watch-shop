import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumProductTypeFilterObjectSchema as EnumProductTypeFilterObjectSchema } from './EnumProductTypeFilter.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumPriceVisibilityFilterObjectSchema as EnumPriceVisibilityFilterObjectSchema } from './EnumPriceVisibilityFilter.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumTagFilterObjectSchema as EnumTagFilterObjectSchema } from './EnumTagFilter.schema';
import { TagSchema } from '../enums/Tag.schema';
import { EnumProductStatusFilterObjectSchema as EnumProductStatusFilterObjectSchema } from './EnumProductStatusFilter.schema';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { EnumContentStatusFilterObjectSchema as EnumContentStatusFilterObjectSchema } from './EnumContentStatusFilter.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { AcquisitionItemListRelationFilterObjectSchema as AcquisitionItemListRelationFilterObjectSchema } from './AcquisitionItemListRelationFilter.schema';
import { AcquisitionSpecJobListRelationFilterObjectSchema as AcquisitionSpecJobListRelationFilterObjectSchema } from './AcquisitionSpecJobListRelationFilter.schema';
import { InvoiceItemListRelationFilterObjectSchema as InvoiceItemListRelationFilterObjectSchema } from './InvoiceItemListRelationFilter.schema';
import { MaintenanceRecordListRelationFilterObjectSchema as MaintenanceRecordListRelationFilterObjectSchema } from './MaintenanceRecordListRelationFilter.schema';
import { OrderItemListRelationFilterObjectSchema as OrderItemListRelationFilterObjectSchema } from './OrderItemListRelationFilter.schema';
import { BrandNullableScalarRelationFilterObjectSchema as BrandNullableScalarRelationFilterObjectSchema } from './BrandNullableScalarRelationFilter.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './BrandWhereInput.schema';
import { ProductCategoryNullableScalarRelationFilterObjectSchema as ProductCategoryNullableScalarRelationFilterObjectSchema } from './ProductCategoryNullableScalarRelationFilter.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { VendorNullableScalarRelationFilterObjectSchema as VendorNullableScalarRelationFilterObjectSchema } from './VendorNullableScalarRelationFilter.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { ProductContentNullableScalarRelationFilterObjectSchema as ProductContentNullableScalarRelationFilterObjectSchema } from './ProductContentNullableScalarRelationFilter.schema';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './ProductContentWhereInput.schema';
import { ProductImageListRelationFilterObjectSchema as ProductImageListRelationFilterObjectSchema } from './ProductImageListRelationFilter.schema';
import { ProductVariantListRelationFilterObjectSchema as ProductVariantListRelationFilterObjectSchema } from './ProductVariantListRelationFilter.schema';
import { ReservationListRelationFilterObjectSchema as ReservationListRelationFilterObjectSchema } from './ReservationListRelationFilter.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema';
import { WatchNullableScalarRelationFilterObjectSchema as WatchNullableScalarRelationFilterObjectSchema } from './WatchNullableScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema';
import { WatchSpecNullableScalarRelationFilterObjectSchema as WatchSpecNullableScalarRelationFilterObjectSchema } from './WatchSpecNullableScalarRelationFilter.schema';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './WatchSpecWhereInput.schema'

const productwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductWhereInputObjectSchema), z.lazy(() => ProductWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductWhereInputObjectSchema), z.lazy(() => ProductWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  primaryImageUrl: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumProductTypeFilterObjectSchema), ProductTypeSchema]).optional(),
  priceVisibility: z.union([z.lazy(() => EnumPriceVisibilityFilterObjectSchema), PriceVisibilitySchema]).optional(),
  brandId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  seoTitle: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  seoDescription: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isStockManaged: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  maxQtyPerOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  publishedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  tag: z.union([z.lazy(() => EnumTagFilterObjectSchema), TagSchema]).optional(),
  status: z.union([z.lazy(() => EnumProductStatusFilterObjectSchema), ProductStatusSchema]).optional(),
  categoryId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  contentStatus: z.union([z.lazy(() => EnumContentStatusFilterObjectSchema), ContentStatusSchema]).optional(),
  postContent: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  aiPromptUsed: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  aiGeneratedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  sku: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  nickname: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  specStatus: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  storefrontImageKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemListRelationFilterObjectSchema).optional(),
  acquisitionSpecJob: z.lazy(() => AcquisitionSpecJobListRelationFilterObjectSchema).optional(),
  invoiceItem: z.lazy(() => InvoiceItemListRelationFilterObjectSchema).optional(),
  maintenanceRecord: z.lazy(() => MaintenanceRecordListRelationFilterObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemListRelationFilterObjectSchema).optional(),
  brand: z.union([z.lazy(() => BrandNullableScalarRelationFilterObjectSchema), z.lazy(() => BrandWhereInputObjectSchema)]).optional(),
  productCategory: z.union([z.lazy(() => ProductCategoryNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductCategoryWhereInputObjectSchema)]).optional(),
  vendor: z.union([z.lazy(() => VendorNullableScalarRelationFilterObjectSchema), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  productContent: z.union([z.lazy(() => ProductContentNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductContentWhereInputObjectSchema)]).optional(),
  productImage: z.lazy(() => ProductImageListRelationFilterObjectSchema).optional(),
  productVariant: z.lazy(() => ProductVariantListRelationFilterObjectSchema).optional(),
  reservation: z.lazy(() => ReservationListRelationFilterObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional(),
  watch: z.union([z.lazy(() => WatchNullableScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional(),
  watchSpec: z.union([z.lazy(() => WatchSpecNullableScalarRelationFilterObjectSchema), z.lazy(() => WatchSpecWhereInputObjectSchema)]).optional()
}).strict();
export const ProductWhereInputObjectSchema: z.ZodType<Prisma.ProductWhereInput> = productwhereinputSchema as unknown as z.ZodType<Prisma.ProductWhereInput>;
export const ProductWhereInputObjectZodSchema = productwhereinputSchema;
