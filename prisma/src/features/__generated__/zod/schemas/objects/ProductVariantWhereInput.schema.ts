import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolNullableFilterObjectSchema as BoolNullableFilterObjectSchema } from './BoolNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AcquisitionItemListRelationFilterObjectSchema as AcquisitionItemListRelationFilterObjectSchema } from './AcquisitionItemListRelationFilter.schema';
import { InvoiceItemListRelationFilterObjectSchema as InvoiceItemListRelationFilterObjectSchema } from './InvoiceItemListRelationFilter.schema';
import { MaintenancePartListRelationFilterObjectSchema as MaintenancePartListRelationFilterObjectSchema } from './MaintenancePartListRelationFilter.schema';
import { MaintenanceRecordListRelationFilterObjectSchema as MaintenanceRecordListRelationFilterObjectSchema } from './MaintenanceRecordListRelationFilter.schema';
import { PartVariantSpecNullableScalarRelationFilterObjectSchema as PartVariantSpecNullableScalarRelationFilterObjectSchema } from './PartVariantSpecNullableScalarRelationFilter.schema';
import { PartVariantSpecWhereInputObjectSchema as PartVariantSpecWhereInputObjectSchema } from './PartVariantSpecWhereInput.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema';
import { StrapVariantSpecNullableScalarRelationFilterObjectSchema as StrapVariantSpecNullableScalarRelationFilterObjectSchema } from './StrapVariantSpecNullableScalarRelationFilter.schema';
import { StrapVariantSpecWhereInputObjectSchema as StrapVariantSpecWhereInputObjectSchema } from './StrapVariantSpecWhereInput.schema'

const productvariantwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductVariantWhereInputObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductVariantWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductVariantWhereInputObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sku: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  price: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  stockQty: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  isStockManaged: z.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  maxQtyPerOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemListRelationFilterObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemListRelationFilterObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartListRelationFilterObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordListRelationFilterObjectSchema).optional(),
  partSpec: z.union([z.lazy(() => PartVariantSpecNullableScalarRelationFilterObjectSchema), z.lazy(() => PartVariantSpecWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional(),
  strapSpec: z.union([z.lazy(() => StrapVariantSpecNullableScalarRelationFilterObjectSchema), z.lazy(() => StrapVariantSpecWhereInputObjectSchema)]).optional()
}).strict();
export const ProductVariantWhereInputObjectSchema: z.ZodType<Prisma.ProductVariantWhereInput> = productvariantwhereinputSchema as unknown as z.ZodType<Prisma.ProductVariantWhereInput>;
export const ProductVariantWhereInputObjectZodSchema = productvariantwhereinputSchema;
