import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapSetTypeSchema } from '../enums/WatchStrapSetType.schema'

const nestedenumwatchstrapsettypenullablefilterSchema = z.object({
  equals: WatchStrapSetTypeSchema.optional().nullable(),
  in: WatchStrapSetTypeSchema.array().optional().nullable(),
  notIn: WatchStrapSetTypeSchema.array().optional().nullable(),
  not: z.union([WatchStrapSetTypeSchema, z.lazy(() => NestedEnumWatchStrapSetTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchStrapSetTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchStrapSetTypeNullableFilter> = nestedenumwatchstrapsettypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchStrapSetTypeNullableFilter>;
export const NestedEnumWatchStrapSetTypeNullableFilterObjectZodSchema = nestedenumwatchstrapsettypenullablefilterSchema;
