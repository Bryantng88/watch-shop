import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapComponentSourceSchema } from '../enums/WatchStrapComponentSource.schema';
import { NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema as NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema } from './NestedEnumWatchStrapComponentSourceNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStrapComponentSourceSchema.optional().nullable(),
  in: WatchStrapComponentSourceSchema.array().optional().nullable(),
  notIn: WatchStrapComponentSourceSchema.array().optional().nullable(),
  not: z.union([WatchStrapComponentSourceSchema, z.lazy(() => NestedEnumWatchStrapComponentSourceNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchStrapComponentSourceNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchStrapComponentSourceNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStrapComponentSourceNullableFilter>;
export const EnumWatchStrapComponentSourceNullableFilterObjectZodSchema = makeSchema();
