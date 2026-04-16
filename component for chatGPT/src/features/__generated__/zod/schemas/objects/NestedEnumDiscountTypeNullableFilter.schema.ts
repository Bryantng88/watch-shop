import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema'

const nestedenumdiscounttypenullablefilterSchema = z.object({
  equals: DiscountTypeSchema.optional().nullable(),
  in: DiscountTypeSchema.array().optional().nullable(),
  notIn: DiscountTypeSchema.array().optional().nullable(),
  not: z.union([DiscountTypeSchema, z.lazy(() => NestedEnumDiscountTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumDiscountTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumDiscountTypeNullableFilter> = nestedenumdiscounttypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumDiscountTypeNullableFilter>;
export const NestedEnumDiscountTypeNullableFilterObjectZodSchema = nestedenumdiscounttypenullablefilterSchema;
