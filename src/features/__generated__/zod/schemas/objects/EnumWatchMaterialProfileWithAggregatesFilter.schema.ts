import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMaterialProfileSchema } from '../enums/WatchMaterialProfile.schema';
import { NestedEnumWatchMaterialProfileWithAggregatesFilterObjectSchema as NestedEnumWatchMaterialProfileWithAggregatesFilterObjectSchema } from './NestedEnumWatchMaterialProfileWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchMaterialProfileFilterObjectSchema as NestedEnumWatchMaterialProfileFilterObjectSchema } from './NestedEnumWatchMaterialProfileFilter.schema'

const makeSchema = () => z.object({
  equals: WatchMaterialProfileSchema.optional(),
  in: WatchMaterialProfileSchema.array().optional(),
  notIn: WatchMaterialProfileSchema.array().optional(),
  not: z.union([WatchMaterialProfileSchema, z.lazy(() => NestedEnumWatchMaterialProfileWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchMaterialProfileFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchMaterialProfileFilterObjectSchema).optional()
}).strict();
export const EnumWatchMaterialProfileWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchMaterialProfileWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchMaterialProfileWithAggregatesFilter>;
export const EnumWatchMaterialProfileWithAggregatesFilterObjectZodSchema = makeSchema();
