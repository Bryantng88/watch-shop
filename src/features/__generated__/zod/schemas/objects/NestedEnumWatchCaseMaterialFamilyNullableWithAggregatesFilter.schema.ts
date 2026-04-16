import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema as NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema } from './NestedEnumWatchCaseMaterialFamilyNullableFilter.schema'

const nestedenumwatchcasematerialfamilynullablewithaggregatesfilterSchema = z.object({
  equals: WatchCaseMaterialFamilySchema.optional().nullable(),
  in: WatchCaseMaterialFamilySchema.array().optional().nullable(),
  notIn: WatchCaseMaterialFamilySchema.array().optional().nullable(),
  not: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NestedEnumWatchCaseMaterialFamilyNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchCaseMaterialFamilyNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyNullableWithAggregatesFilter> = nestedenumwatchcasematerialfamilynullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyNullableWithAggregatesFilter>;
export const NestedEnumWatchCaseMaterialFamilyNullableWithAggregatesFilterObjectZodSchema = nestedenumwatchcasematerialfamilynullablewithaggregatesfilterSchema;
