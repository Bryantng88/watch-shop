import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { NestedEnumContentStatusNullableFilterObjectSchema as NestedEnumContentStatusNullableFilterObjectSchema } from './NestedEnumContentStatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ContentStatusSchema.optional().nullable(),
  in: ContentStatusSchema.array().optional().nullable(),
  notIn: ContentStatusSchema.array().optional().nullable(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumContentStatusNullableFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumContentStatusNullableFilter>;
export const EnumContentStatusNullableFilterObjectZodSchema = makeSchema();
