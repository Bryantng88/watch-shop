import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.literal(true).optional(),
  model: z.literal(true).optional(),
  year: z.literal(true).optional(),
  caseType: z.literal(true).optional(),
  gender: z.literal(true).optional(),
  length: z.literal(true).optional(),
  width: z.literal(true).optional(),
  thickness: z.literal(true).optional(),
  movement: z.literal(true).optional(),
  caliber: z.literal(true).optional(),
  caseMaterial: z.literal(true).optional(),
  goldKarat: z.literal(true).optional(),
  goldColor: z.literal(true).optional(),
  caseSize: z.literal(true).optional(),
  dialColor: z.literal(true).optional(),
  marketSegmentId: z.literal(true).optional(),
  strap: z.literal(true).optional(),
  glass: z.literal(true).optional(),
  boxIncluded: z.literal(true).optional(),
  bookletIncluded: z.literal(true).optional(),
  cardIncluded: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  sizeCategory: z.literal(true).optional()
}).strict();
export const WatchSpecMinAggregateInputObjectSchema: z.ZodType<Prisma.WatchSpecMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecMinAggregateInputType>;
export const WatchSpecMinAggregateInputObjectZodSchema = makeSchema();
