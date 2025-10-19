import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema as CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema } from './CustomerCreateNestedOneWithoutAcquisitionInput.schema';
import { VendorCreateNestedOneWithoutAcquisitionsInputObjectSchema as VendorCreateNestedOneWithoutAcquisitionsInputObjectSchema } from './VendorCreateNestedOneWithoutAcquisitionsInput.schema';
import { AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutAcquisitionInput.schema';
import { InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema as InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema } from './InvoiceCreateNestedManyWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: AcquisitionTypeSchema.optional(),
  acquiredAt: z.coerce.date(),
  cost: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  payoutStatus: z.string().optional().nullable(),
  refNo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  warrantyUntil: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutAcquisitionsInputObjectSchema).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema)
}).strict();
export const AcquisitionCreateInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateInput>;
export const AcquisitionCreateInputObjectZodSchema = makeSchema();
