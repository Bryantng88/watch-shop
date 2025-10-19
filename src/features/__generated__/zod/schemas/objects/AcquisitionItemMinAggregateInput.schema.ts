import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  variantId: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  unitCost: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  sourceOrderItemId: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const AcquisitionItemMinAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemMinAggregateInputType>;
export const AcquisitionItemMinAggregateInputObjectZodSchema = makeSchema();
