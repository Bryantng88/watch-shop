import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema';
import { NestedEnumWatchSaleStageFilterObjectSchema as NestedEnumWatchSaleStageFilterObjectSchema } from './NestedEnumWatchSaleStageFilter.schema'

const makeSchema = () => z.object({
  equals: WatchSaleStageSchema.optional(),
  in: WatchSaleStageSchema.array().optional(),
  notIn: WatchSaleStageSchema.array().optional(),
  not: z.union([WatchSaleStageSchema, z.lazy(() => NestedEnumWatchSaleStageFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchSaleStageFilterObjectSchema: z.ZodType<Prisma.EnumWatchSaleStageFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchSaleStageFilter>;
export const EnumWatchSaleStageFilterObjectZodSchema = makeSchema();
