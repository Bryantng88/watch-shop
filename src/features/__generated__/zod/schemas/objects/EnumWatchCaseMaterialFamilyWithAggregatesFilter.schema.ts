import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { NestedEnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema as NestedEnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema } from './NestedEnumWatchCaseMaterialFamilyWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchCaseMaterialFamilyFilterObjectSchema as NestedEnumWatchCaseMaterialFamilyFilterObjectSchema } from './NestedEnumWatchCaseMaterialFamilyFilter.schema'

const makeSchema = () => z.object({
  equals: WatchCaseMaterialFamilySchema.optional(),
  in: WatchCaseMaterialFamilySchema.array().optional(),
  notIn: WatchCaseMaterialFamilySchema.array().optional(),
  not: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NestedEnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchCaseMaterialFamilyFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchCaseMaterialFamilyFilterObjectSchema).optional()
}).strict();
export const EnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchCaseMaterialFamilyWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchCaseMaterialFamilyWithAggregatesFilter>;
export const EnumWatchCaseMaterialFamilyWithAggregatesFilterObjectZodSchema = makeSchema();
