import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchGoldTreatmentNullableFilterObjectSchema as NestedEnumWatchGoldTreatmentNullableFilterObjectSchema } from './NestedEnumWatchGoldTreatmentNullableFilter.schema'

const nestedenumwatchgoldtreatmentnullablewithaggregatesfilterSchema = z.object({
  equals: WatchGoldTreatmentSchema.optional().nullable(),
  in: WatchGoldTreatmentSchema.array().optional().nullable(),
  notIn: WatchGoldTreatmentSchema.array().optional().nullable(),
  not: z.union([WatchGoldTreatmentSchema, z.lazy(() => NestedEnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchGoldTreatmentNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchGoldTreatmentNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchGoldTreatmentNullableWithAggregatesFilter> = nestedenumwatchgoldtreatmentnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchGoldTreatmentNullableWithAggregatesFilter>;
export const NestedEnumWatchGoldTreatmentNullableWithAggregatesFilterObjectZodSchema = nestedenumwatchgoldtreatmentnullablewithaggregatesfilterSchema;
