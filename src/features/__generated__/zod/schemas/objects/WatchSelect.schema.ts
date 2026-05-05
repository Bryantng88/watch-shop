import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { WatchContentArgsObjectSchema as WatchContentArgsObjectSchema } from './WatchContentArgs.schema';
import { WatchPriceArgsObjectSchema as WatchPriceArgsObjectSchema } from './WatchPriceArgs.schema';
import { WatchSpecV2ArgsObjectSchema as WatchSpecV2ArgsObjectSchema } from './WatchSpecV2Args.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  legacyVariantId: z.boolean().optional(),
  acquisitionId: z.boolean().optional(),
  stockState: z.boolean().optional(),
  saleState: z.boolean().optional(),
  serviceState: z.boolean().optional(),
  siteChannel: z.boolean().optional(),
  gender: z.boolean().optional(),
  conditionGrade: z.boolean().optional(),
  movementType: z.boolean().optional(),
  movementCalibre: z.boolean().optional(),
  serialNumber: z.boolean().optional(),
  yearText: z.boolean().optional(),
  style: z.boolean().optional(),
  hasBox: z.boolean().optional(),
  hasPapers: z.boolean().optional(),
  specStatus: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  watchContent: z.union([z.boolean(), z.lazy(() => WatchContentArgsObjectSchema)]).optional(),
  watchPrice: z.union([z.boolean(), z.lazy(() => WatchPriceArgsObjectSchema)]).optional(),
  watchSpecV2: z.union([z.boolean(), z.lazy(() => WatchSpecV2ArgsObjectSchema)]).optional()
}).strict();
export const WatchSelectObjectSchema: z.ZodType<Prisma.WatchSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchSelect>;
export const WatchSelectObjectZodSchema = makeSchema();
