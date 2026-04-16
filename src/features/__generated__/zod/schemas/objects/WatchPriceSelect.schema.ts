import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  watchId: z.boolean().optional(),
  costPrice: z.boolean().optional(),
  serviceCost: z.boolean().optional(),
  landedCost: z.boolean().optional(),
  listPrice: z.boolean().optional(),
  salePrice: z.boolean().optional(),
  minPrice: z.boolean().optional(),
  pricingNote: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchPriceSelectObjectSchema: z.ZodType<Prisma.WatchPriceSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceSelect>;
export const WatchPriceSelectObjectZodSchema = makeSchema();
