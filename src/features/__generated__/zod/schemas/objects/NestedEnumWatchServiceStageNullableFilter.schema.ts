import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema'

const nestedenumwatchservicestagenullablefilterSchema = z.object({
  equals: WatchServiceStageSchema.optional().nullable(),
  in: WatchServiceStageSchema.array().optional().nullable(),
  notIn: WatchServiceStageSchema.array().optional().nullable(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchServiceStageNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchServiceStageNullableFilter> = nestedenumwatchservicestagenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchServiceStageNullableFilter>;
export const NestedEnumWatchServiceStageNullableFilterObjectZodSchema = nestedenumwatchservicestagenullablefilterSchema;
