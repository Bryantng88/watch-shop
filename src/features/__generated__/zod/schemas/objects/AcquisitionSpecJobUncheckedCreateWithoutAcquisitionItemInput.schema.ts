import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  status: z.string().optional(),
  attempts: z.number().int().optional(),
  lastError: z.string().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  finishedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  runAfter: z.coerce.date().optional().nullable(),
  priority: z.number().int().optional()
}).strict();
export const AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInput>;
export const AcquisitionSpecJobUncheckedCreateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
