import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchCaseMaterialFamilyFilterObjectSchema as NestedEnumWatchCaseMaterialFamilyFilterObjectSchema } from './NestedEnumWatchCaseMaterialFamilyFilter.schema'

const nestedenumwatchcasematerialfamilywithaggregatesfilterSchema = z.object({
  equals: WatchCaseMaterialFamilySchema.optional(),
  in: WatchCaseMaterialFamilySchema.array().optional(),
  notIn: WatchCaseMaterialFamilySchema.array().optional(),
  not: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NestedEnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchCaseMaterialFamilyFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchCaseMaterialFamilyFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchCaseMaterialFamilyWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyWithAggregatesFilter> = nestedenumwatchcasematerialfamilywithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyWithAggregatesFilter>;
export const NestedEnumWatchCaseMaterialFamilyWithAggregatesFilterObjectZodSchema = nestedenumwatchcasematerialfamilywithaggregatesfilterSchema;
