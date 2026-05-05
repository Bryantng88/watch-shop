import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStyleSchema } from '../enums/WatchStyle.schema'

const nestedenumwatchstylenullablefilterSchema = z.object({
  equals: WatchStyleSchema.optional().nullable(),
  in: WatchStyleSchema.array().optional().nullable(),
  notIn: WatchStyleSchema.array().optional().nullable(),
  not: z.union([WatchStyleSchema, z.lazy(() => NestedEnumWatchStyleNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchStyleNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStyleNullableFilter> = nestedenumwatchstylenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStyleNullableFilter>;
export const NestedEnumWatchStyleNullableFilterObjectZodSchema = nestedenumwatchstylenullablefilterSchema;
