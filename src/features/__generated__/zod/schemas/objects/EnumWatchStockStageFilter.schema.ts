import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { NestedEnumWatchStockStageFilterObjectSchema as NestedEnumWatchStockStageFilterObjectSchema } from './NestedEnumWatchStockStageFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStockStageSchema.optional(),
  in: WatchStockStageSchema.array().optional(),
  notIn: WatchStockStageSchema.array().optional(),
  not: z.union([WatchStockStageSchema, z.lazy(() => NestedEnumWatchStockStageFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchStockStageFilterObjectSchema: z.ZodType<Prisma.EnumWatchStockStageFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStockStageFilter>;
export const EnumWatchStockStageFilterObjectZodSchema = makeSchema();
