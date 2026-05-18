import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema'

const nestedenumwatchstockstagefilterSchema = z.object({
  equals: WatchStockStageSchema.optional(),
  in: WatchStockStageSchema.array().optional(),
  notIn: WatchStockStageSchema.array().optional(),
  not: z.union([WatchStockStageSchema, z.lazy(() => NestedEnumWatchStockStageFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchStockStageFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStockStageFilter> = nestedenumwatchstockstagefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStockStageFilter>;
export const NestedEnumWatchStockStageFilterObjectZodSchema = nestedenumwatchstockstagefilterSchema;
