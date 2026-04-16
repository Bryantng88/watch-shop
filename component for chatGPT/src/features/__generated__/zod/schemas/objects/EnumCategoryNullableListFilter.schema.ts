import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CategorySchema } from '../enums/Category.schema'

const makeSchema = () => z.object({
  equals: CategorySchema.array().optional().nullable(),
  has: CategorySchema.optional().nullable(),
  hasEvery: CategorySchema.array().optional(),
  hasSome: CategorySchema.array().optional(),
  isEmpty: z.boolean().optional()
}).strict();
export const EnumCategoryNullableListFilterObjectSchema: z.ZodType<Prisma.EnumCategoryNullableListFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCategoryNullableListFilter>;
export const EnumCategoryNullableListFilterObjectZodSchema = makeSchema();
