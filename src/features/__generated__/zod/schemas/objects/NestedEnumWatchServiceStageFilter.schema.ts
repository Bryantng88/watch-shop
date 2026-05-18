import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema'

const nestedenumwatchservicestagefilterSchema = z.object({
  equals: WatchServiceStageSchema.optional(),
  in: WatchServiceStageSchema.array().optional(),
  notIn: WatchServiceStageSchema.array().optional(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchServiceStageFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchServiceStageFilter> = nestedenumwatchservicestagefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchServiceStageFilter>;
export const NestedEnumWatchServiceStageFilterObjectZodSchema = nestedenumwatchservicestagefilterSchema;
