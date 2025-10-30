import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema';
import { AcquisitionItemCreateNestedManyWithoutVariantInputObjectSchema as AcquisitionItemCreateNestedManyWithoutVariantInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutVariantInput.schema';
import { InvoiceItemCreateNestedManyWithoutVariantInputObjectSchema as InvoiceItemCreateNestedManyWithoutVariantInputObjectSchema } from './InvoiceItemCreateNestedManyWithoutVariantInput.schema';
import { MaintenancePartCreateNestedManyWithoutVariantInputObjectSchema as MaintenancePartCreateNestedManyWithoutVariantInputObjectSchema } from './MaintenancePartCreateNestedManyWithoutVariantInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutVariantInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutVariantInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutVariantInput.schema';
import { PartVariantSpecCreateNestedOneWithoutVariantInputObjectSchema as PartVariantSpecCreateNestedOneWithoutVariantInputObjectSchema } from './PartVariantSpecCreateNestedOneWithoutVariantInput.schema';
import { ServiceRequestCreateNestedManyWithoutVariantInputObjectSchema as ServiceRequestCreateNestedManyWithoutVariantInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutVariantInput.schema';
import { StrapVariantSpecCreateNestedOneWithoutVariantInputObjectSchema as StrapVariantSpecCreateNestedOneWithoutVariantInputObjectSchema } from './StrapVariantSpecCreateNestedOneWithoutVariantInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  sku: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  stockQty: z.number().int().optional(),
  isStockManaged: z.boolean().optional().nullable(),
  maxQtyPerOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  availabilityStatuts: AvailabilityStatusSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  InvoiceItem: z.lazy(() => InvoiceItemCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  MaintenancePart: z.lazy(() => MaintenancePartCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  MaintenanceRecord: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  partSpec: z.lazy(() => PartVariantSpecCreateNestedOneWithoutVariantInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutVariantInputObjectSchema).optional(),
  strapSpec: z.lazy(() => StrapVariantSpecCreateNestedOneWithoutVariantInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateWithoutProductInput>;
export const ProductVariantCreateWithoutProductInputObjectZodSchema = makeSchema();
