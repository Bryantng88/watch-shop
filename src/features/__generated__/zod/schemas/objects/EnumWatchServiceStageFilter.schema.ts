import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchServiceStageSchema } from '../enums/WatchServiceStage.schema';
import { NestedEnumWatchServiceStageFilterObjectSchema as NestedEnumWatchServiceStageFilterObjectSchema } from './NestedEnumWatchServiceStageFilter.schema'

const makeSchema = () => z.object({
  equals: WatchServiceStageSchema.optional(),
  in: WatchServiceStageSchema.array().optional(),
  notIn: WatchServiceStageSchema.array().optional(),
  not: z.union([WatchServiceStageSchema, z.lazy(() => NestedEnumWatchServiceStageFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchServiceStageFilterObjectSchema: z.ZodType<Prisma.EnumWatchServiceStageFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchServiceStageFilter>;
export const EnumWatchServiceStageFilterObjectZodSchema = makeSchema();
