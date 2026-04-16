import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  costPrice: z.number().optional().nullable(),
  serviceCost: z.number().optional().nullable(),
  landedCost: z.number().optional().nullable(),
  listPrice: z.number().optional().nullable(),
  salePrice: z.number().optional().nullable(),
  minPrice: z.number().optional().nullable(),
  pricingNote: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WatchPriceUncheckedCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchPriceUncheckedCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceUncheckedCreateWithoutWatchInput>;
export const WatchPriceUncheckedCreateWithoutWatchInputObjectZodSchema = makeSchema();
