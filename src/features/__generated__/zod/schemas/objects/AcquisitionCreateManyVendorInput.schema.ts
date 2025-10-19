import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  customerId: z.string().optional().nullable(),
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
  updatedAt: z.coerce.date().optional()
}).strict();
export const AcquisitionCreateManyVendorInputObjectSchema: z.ZodType<Prisma.AcquisitionCreateManyVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCreateManyVendorInput>;
export const AcquisitionCreateManyVendorInputObjectZodSchema = makeSchema();
