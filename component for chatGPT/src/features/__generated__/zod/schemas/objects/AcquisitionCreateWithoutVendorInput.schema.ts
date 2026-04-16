import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema as CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema } from './CustomerCreateNestedOneWithoutAcquisitionInput.schema';
import { AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema as AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutAcquisitionInput.schema';
import { InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema as InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema } from './InvoiceCreateNestedManyWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: AcquisitionTypeSchema.optional(),
  acquiredAt: z.coerce.date(),
  cost: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  payoutStatus: z.string().optional().nullable(),
  accquisitionStt: AcquisitionStatusSchema.optional(),
  refNo: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  warrantyUntil: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  returnedAt: z.coerce.date().optional().nullable(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutAcquisitionInputObjectSchema).optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutAcquisitionInputObjectSchema).optional(),
  invoice: z.lazy(() => InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema).optional()
}).strict();
export const AcquisitionCreateWithoutVendorInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateWithoutVendorInput>;
export const AcquisitionCreateWithoutVendorInputObjectZodSchema = makeSchema();
