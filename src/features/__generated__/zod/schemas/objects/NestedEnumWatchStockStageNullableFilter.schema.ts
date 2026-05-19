import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema'

const nestedenumwatchstockstagenullablefilterSchema = z.object({
  equals: WatchStockStageSchema.optional().nullable(),
  in: WatchStockStageSchema.array().optional().nullable(),
  notIn: WatchStockStageSchema.array().optional().nullable(),
  not: z.union([WatchStockStageSchema, z.lazy(() => NestedEnumWatchStockStageNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchStockStageNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStockStageNullableFilter> = nestedenumwatchstockstagenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStockStageNullableFilter>;
export const NestedEnumWatchStockStageNullableFilterObjectZodSchema = nestedenumwatchstockstagenullablefilterSchema;
