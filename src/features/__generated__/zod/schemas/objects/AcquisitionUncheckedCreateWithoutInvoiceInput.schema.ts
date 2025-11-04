import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { AcquisitionStatusSchema } from '../enums/AcquisitionStatus.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInput.schema'

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
  acquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutAcquisitionInputObjectSchema).optional()
}).strict();
export const AcquisitionUncheckedCreateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.AcquisitionUncheckedCreateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionUncheckedCreateWithoutInvoiceInput>;
export const AcquisitionUncheckedCreateWithoutInvoiceInputObjectZodSchema = makeSchema();
