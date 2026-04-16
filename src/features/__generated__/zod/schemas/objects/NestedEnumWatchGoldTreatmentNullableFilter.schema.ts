import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchGoldTreatmentSchema } from '../enums/WatchGoldTreatment.schema'

const nestedenumwatchgoldtreatmentnullablefilterSchema = z.object({
  equals: WatchGoldTreatmentSchema.optional().nullable(),
  in: WatchGoldTreatmentSchema.array().optional().nullable(),
  notIn: WatchGoldTreatmentSchema.array().optional().nullable(),
  not: z.union([WatchGoldTreatmentSchema, z.lazy(() => NestedEnumWatchGoldTreatmentNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchGoldTreatmentNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchGoldTreatmentNullableFilter> = nestedenumwatchgoldtreatmentnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchGoldTreatmentNullableFilter>;
export const NestedEnumWatchGoldTreatmentNullableFilterObjectZodSchema = nestedenumwatchgoldtreatmentnullablefilterSchema;
