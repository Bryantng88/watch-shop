import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStockStageSchema } from '../enums/WatchStockStage.schema';
import { NestedEnumWatchStockStageNullableFilterObjectSchema as NestedEnumWatchStockStageNullableFilterObjectSchema } from './NestedEnumWatchStockStageNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStockStageSchema.optional().nullable(),
  in: WatchStockStageSchema.array().optional().nullable(),
  notIn: WatchStockStageSchema.array().optional().nullable(),
  not: z.union([WatchStockStageSchema, z.lazy(() => NestedEnumWatchStockStageNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchStockStageNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchStockStageNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStockStageNullableFilter>;
export const EnumWatchStockStageNullableFilterObjectZodSchema = makeSchema();
