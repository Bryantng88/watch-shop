import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisitionItemId: z.string(),
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
export const AcquisitionSpecJobCreateManyInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateManyInput>;
export const AcquisitionSpecJobCreateManyInputObjectZodSchema = makeSchema();
