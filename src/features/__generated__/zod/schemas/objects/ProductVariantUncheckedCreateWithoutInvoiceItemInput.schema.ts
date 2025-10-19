import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutVariantInput.schema';
import { MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema as MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedCreateNestedManyWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInput.schema';
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
  isActive: z.boolean().optional(),
  maxQtyPerOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  partSpec: z.lazy(() => PartVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  strapSpec: z.lazy(() => StrapVariantSpecUncheckedCreateNestedOneWithoutVariantInputObjectSchema).optional()
}).strict();
export const ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUncheckedCreateWithoutInvoiceItemInput>;
export const ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectZodSchema = makeSchema();
