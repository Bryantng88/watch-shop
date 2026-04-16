import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema';
import { NestedEnumWatchGoldTreatmentNullableFilterObjectSchema as NestedEnumWatchGoldTreatmentNullableFilterObjectSchema } from './NestedEnumWatchGoldTreatmentNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchGoldTreatmentSchema.optional().nullable(),
  in: WatchGoldTreatmentSchema.array().optional().nullable(),
  notIn: WatchGoldTreatmentSchema.array().optional().nullable(),
  not: z.union([WatchGoldTreatmentSchema, z.lazy(() => NestedEnumWatchGoldTreatmentNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchGoldTreatmentNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchGoldTreatmentNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchGoldTreatmentNullableFilter>;
export const EnumWatchGoldTreatmentNullableFilterObjectZodSchema = makeSchema();
