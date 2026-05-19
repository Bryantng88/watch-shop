import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { NestedEnumWatchSaleStageNullableFilterObjectSchema as NestedEnumWatchSaleStageNullableFilterObjectSchema } from './NestedEnumWatchSaleStageNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchSaleStageSchema.optional().nullable(),
  in: WatchSaleStageSchema.array().optional().nullable(),
  notIn: WatchSaleStageSchema.array().optional().nullable(),
  not: z.union([WatchSaleStageSchema, z.lazy(() => NestedEnumWatchSaleStageNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchSaleStageNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchSaleStageNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSaleStageNullableFilter>;
export const EnumWatchSaleStageNullableFilterObjectZodSchema = makeSchema();
