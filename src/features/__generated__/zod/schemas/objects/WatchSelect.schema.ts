import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { WatchContentArgsObjectSchema as WatchContentArgsObjectSchema } from './WatchContentArgs.schema';
import { WatchMediaFindManySchema as WatchMediaFindManySchema } from '../findManyWatchMedia.schema';
import { WatchPriceArgsObjectSchema as WatchPriceArgsObjectSchema } from './WatchPriceArgs.schema';
import { WatchSpecV2ArgsObjectSchema as WatchSpecV2ArgsObjectSchema } from './WatchSpecV2Args.schema';
import { WatchCountOutputTypeArgsObjectSchema as WatchCountOutputTypeArgsObjectSchema } from './WatchCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  legacyVariantId: z.boolean().optional(),
  acquisitionId: z.boolean().optional(),
  stockState: z.boolean().optional(),
  saleState: z.boolean().optional(),
  serviceState: z.boolean().optional(),
  gender: z.boolean().optional(),
  siteChannel: z.boolean().optional(),
  conditionGrade: z.boolean().optional(),
  movementType: z.boolean().optional(),
  movementCalibre: z.boolean().optional(),
  serialNumber: z.boolean().optional(),
  yearText: z.boolean().optional(),
  hasBox: z.boolean().optional(),
  hasPapers: z.boolean().optional(),
  attachedStrapId: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  watchContent: z.union([z.boolean(), z.lazy(() => WatchContentArgsObjectSchema)]).optional(),
  watchMedia: z.union([z.boolean(), z.lazy(() => WatchMediaFindManySchema)]).optional(),
  watchPrice: z.union([z.boolean(), z.lazy(() => WatchPriceArgsObjectSchema)]).optional(),
  watchSpecV2: z.union([z.boolean(), z.lazy(() => WatchSpecV2ArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => WatchCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const WatchSelectObjectSchema: z.ZodType<Prisma.WatchSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchSelect>;
export const WatchSelectObjectZodSchema = makeSchema();
