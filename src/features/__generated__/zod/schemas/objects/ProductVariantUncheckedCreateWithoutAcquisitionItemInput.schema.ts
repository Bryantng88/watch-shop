import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInput.schema';
import { MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInput.schema';
import { PartVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectSchema as PartVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateNestedOneWithoutProductVariantInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutProductVariantInput.schema';
import { StrapVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectSchema as StrapVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateNestedOneWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
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
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  PartVariantSpec: z.lazy(() => PartVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema).optional(),
  StrapVariantSpec: z.lazy(() => StrapVariantSpecUncheckedCreateNestedOneWithoutProductVariantInputObjectSchema).optional()
}).strict();
export const ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutAcquisitionItemInput>;
export const ProductVariantUncheckedCreateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
