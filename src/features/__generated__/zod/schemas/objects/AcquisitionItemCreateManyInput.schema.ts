import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisitionId: z.string(),
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sourceOrderItemId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const AcquisitionItemCreateManyInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateManyInput>;
export const AcquisitionItemCreateManyInputObjectZodSchema = makeSchema();
