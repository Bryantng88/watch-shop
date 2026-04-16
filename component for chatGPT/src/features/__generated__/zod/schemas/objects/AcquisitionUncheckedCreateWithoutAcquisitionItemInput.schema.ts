import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { InvoiceUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutAcquisitionInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  vendorId: z.string().optional().nullable(),
  customerId: z.string().optional().nullable(),
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
  invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema).optional()
}).strict();
export const AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedCreateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedCreateWithoutAcquisitionItemInput>;
export const AcquisitionUncheckedCreateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
