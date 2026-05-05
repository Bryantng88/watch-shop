import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapSetTypeSchema } from '../enums/WatchStrapSetType.schema';
import { NestedEnumWatchStrapSetTypeNullableFilterObjectSchema as NestedEnumWatchStrapSetTypeNullableFilterObjectSchema } from './NestedEnumWatchStrapSetTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchStrapSetTypeSchema.optional().nullable(),
  in: WatchStrapSetTypeSchema.array().optional().nullable(),
  notIn: WatchStrapSetTypeSchema.array().optional().nullable(),
  not: z.union([WatchStrapSetTypeSchema, z.lazy(() => NestedEnumWatchStrapSetTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchStrapSetTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchStrapSetTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchStrapSetTypeNullableFilter>;
export const EnumWatchStrapSetTypeNullableFilterObjectZodSchema = makeSchema();
