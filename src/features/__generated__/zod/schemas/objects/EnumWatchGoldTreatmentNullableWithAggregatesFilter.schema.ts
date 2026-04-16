import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema';
import { NestedEnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema as NestedEnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchGoldTreatmentNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchGoldTreatmentNullableFilterObjectSchema as NestedEnumWatchGoldTreatmentNullableFilterObjectSchema } from './NestedEnumWatchGoldTreatmentNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchGoldTreatmentSchema.optional().nullable(),
  in: WatchGoldTreatmentSchema.array().optional().nullable(),
  notIn: WatchGoldTreatmentSchema.array().optional().nullable(),
  not: z.union([WatchGoldTreatmentSchema, z.lazy(() => NestedEnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchGoldTreatmentNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchGoldTreatmentNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchGoldTreatmentNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchGoldTreatmentNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchGoldTreatmentNullableWithAggregatesFilter>;
export const EnumWatchGoldTreatmentNullableWithAggregatesFilterObjectZodSchema = makeSchema();
