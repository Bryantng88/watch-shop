import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema'

const nestedenumwatchsalestagenullablefilterSchema = z.object({
  equals: WatchSaleStageSchema.optional().nullable(),
  in: WatchSaleStageSchema.array().optional().nullable(),
  notIn: WatchSaleStageSchema.array().optional().nullable(),
  not: z.union([WatchSaleStageSchema, z.lazy(() => NestedEnumWatchSaleStageNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchSaleStageNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchSaleStageNullableFilter> = nestedenumwatchsalestagenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchSaleStageNullableFilter>;
export const NestedEnumWatchSaleStageNullableFilterObjectZodSchema = nestedenumwatchsalestagenullablefilterSchema;
