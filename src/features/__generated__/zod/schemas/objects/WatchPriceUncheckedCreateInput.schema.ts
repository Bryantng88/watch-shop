import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  watchId: z.string(),
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
export const WatchPriceUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WatchPriceUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceUncheckedCreateInput>;
export const WatchPriceUncheckedCreateInputObjectZodSchema = makeSchema();
