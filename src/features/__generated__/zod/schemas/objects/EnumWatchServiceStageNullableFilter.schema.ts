import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { NestedEnumWatchServiceStageNullableFilterObjectSchema as NestedEnumWatchServiceStageNullableFilterObjectSchema } from './NestedEnumWatchServiceStageNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchServiceStageSchema.optional().nullable(),
  in: WatchServiceStageSchema.array().optional().nullable(),
  notIn: WatchServiceStageSchema.array().optional().nullable(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchServiceStageNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchServiceStageNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchServiceStageNullableFilter>;
export const EnumWatchServiceStageNullableFilterObjectZodSchema = makeSchema();
