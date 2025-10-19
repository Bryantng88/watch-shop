import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutVariantInput.schema';
import { InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema as InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedCreateNestedManyWithoutVariantInput.schema';
import { MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema as MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedCreateNestedManyWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInput.schema';
import { PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema as PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema } from './PartVariantSpecUncheckedCreateNestedOneWithoutVariantInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutVariantInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  sku: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  stockQty: z.number().int().optional(),
  isStockManaged: z.boolean().optional().nullable(),
  isActive: z.boolean().optional(),
  maxQtyPerOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  partSpec: z.lazy(() => PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional()
}).strict();
export const ProductVariantUncheckedCreateWithoutStrapSpecInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutStrapSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutStrapSpecInput>;
export const ProductVariantUncheckedCreateWithoutStrapSpecInputObjectZodSchema = makeSchema();
