import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutVariantInput.schema';
import { InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema as InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedCreateNestedManyWithoutVariantInput.schema';
import { MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema as MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedCreateNestedManyWithoutVariantInput.schema';
import { PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema as PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateNestedOneWithoutVariantInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutVariantInput.schema';
import { StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema as StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema } from './StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInput.schema'

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
  updatedAt: z.coerce.date().optional(),
  availabilityStatuts: AvailabilityStatusSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  partSpec: z.lazy(() => PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  strapSpec: z.lazy(() => StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema).optional()
}).strict();
export const ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutMaintenanceRecordInput>;
export const ProductVariantUncheckedCreateWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
