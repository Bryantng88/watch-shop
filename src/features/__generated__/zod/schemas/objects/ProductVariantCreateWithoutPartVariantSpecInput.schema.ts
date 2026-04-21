import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { AcquisitionItemCreateNestedManyWithoutProductVariantInputObjectSchema as AcquisitionItemCreateNestedManyWithoutProductVariantInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutProductVariantInput.schema';
import { InvoiceItemCreateNestedManyWithoutProductVariantInputObjectSchema as InvoiceItemCreateNestedManyWithoutProductVariantInputObjectSchema } from './InvoiceItemCreateNestedManyWithoutProductVariantInput.schema';
import { MaintenancePartCreateNestedManyWithoutProductVariantInputObjectSchema as MaintenancePartCreateNestedManyWithoutProductVariantInputObjectSchema } from './MaintenancePartCreateNestedManyWithoutProductVariantInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutProductVariantInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutProductVariantInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutProductVariantInput.schema';
import { ProductCreateNestedOneWithoutProductVariantInputObjectSchema as ProductCreateNestedOneWithoutProductVariantInputObjectSchema } from './ProductCreateNestedOneWithoutProductVariantInput.schema';
import { ServiceRequestCreateNestedManyWithoutProductVariantInputObjectSchema as ServiceRequestCreateNestedManyWithoutProductVariantInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutProductVariantInput.schema';
import { StrapVariantSpecCreateNestedOneWithoutProductVariantInputObjectSchema as StrapVariantSpecCreateNestedOneWithoutProductVariantInputObjectSchema } from './StrapVariantSpecCreateNestedOneWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  sku: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  stockQty: z.number().int().optional(),
  isStockManaged: z.boolean().optional().nullable(),
  maxQtyPerOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date(),
  availabilityStatus: AvailabilityStatusSchema.optional(),
  listPrice: z.number().optional().nullable(),
  discountType: DiscountTypeSchema.optional().nullable(),
  discountValue: z.number().optional().nullable(),
  salePrice: z.number().optional().nullable(),
  saleStartsAt: z.coerce.date().optional().nullable(),
  saleEndsAt: z.coerce.date().optional().nullable(),
  costPrice: z.number().optional().nullable(),
  AcquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedOneWithoutProductVariantInputObjectSchema),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  StrapVariantSpec: z.lazy(() => StrapVariantSpecCreateNestedOneWithoutProductVariantInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateWithoutPartVariantSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateWithoutPartVariantSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateWithoutPartVariantSpecInput>;
export const ProductVariantCreateWithoutPartVariantSpecInputObjectZodSchema = makeSchema();
