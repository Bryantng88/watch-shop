import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSaleStageSchema } from '../enums/WatchSaleStage.schema'

const nestedenumwatchsalestagefilterSchema = z.object({
  equals: WatchSaleStageSchema.optional(),
  in: WatchSaleStageSchema.array().optional(),
  notIn: WatchSaleStageSchema.array().optional(),
  not: z.union([WatchSaleStageSchema, z.lazy(() => NestedEnumWatchSaleStageFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchSaleStageFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchSaleStageFilter> = nestedenumwatchsalestagefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchSaleStageFilter>;
export const NestedEnumWatchSaleStageFilterObjectZodSchema = nestedenumwatchsalestagefilterSchema;
