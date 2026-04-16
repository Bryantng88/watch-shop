import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchCaseMaterialFamilySchema } from '../enums/WatchCaseMaterialFamily.schema'

const nestedenumwatchcasematerialfamilynullablefilterSchema = z.object({
  equals: WatchCaseMaterialFamilySchema.optional().nullable(),
  in: WatchCaseMaterialFamilySchema.array().optional().nullable(),
  notIn: WatchCaseMaterialFamilySchema.array().optional().nullable(),
  not: z.union([WatchCaseMaterialFamilySchema, z.lazy(() => NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchCaseMaterialFamilyNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyNullableFilter> = nestedenumwatchcasematerialfamilynullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchCaseMaterialFamilyNullableFilter>;
export const NestedEnumWatchCaseMaterialFamilyNullableFilterObjectZodSchema = nestedenumwatchcasematerialfamilynullablefilterSchema;
