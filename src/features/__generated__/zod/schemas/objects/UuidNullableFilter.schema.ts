import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { QueryModeSchema } from '../enums/QueryMode.schema';
import { NestedUuidNullableFilterObjectSchema as NestedUuidNullableFilterObjectSchema } from './NestedUuidNullableFilter.schema'

const makeSchema = () => z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: QueryModeSchema.optional(),
  not: z.union([z.string(), z.lazy(() => NestedUuidNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const UuidNullableFilterObjectSchema: z.ZodType<Prisma.UuidNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.UuidNullableFilter>;
export const UuidNullableFilterObjectZodSchema = makeSchema();
