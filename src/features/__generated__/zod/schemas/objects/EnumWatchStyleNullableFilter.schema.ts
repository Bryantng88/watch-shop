import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStyleSchema } from '../enums/WatchStyle.schema';
import { NestedEnumWatchStyleNullableFilterObjectSchema as NestedEnumWatchStyleNullableFilterObjectSchema } from './NestedEnumWatchStyleNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStyleSchema.optional().nullable(),
  in: WatchStyleSchema.array().optional().nullable(),
  notIn: WatchStyleSchema.array().optional().nullable(),
  not: z.union([WatchStyleSchema, z.lazy(() => NestedEnumWatchStyleNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchStyleNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchStyleNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStyleNullableFilter>;
export const EnumWatchStyleNullableFilterObjectZodSchema = makeSchema();
