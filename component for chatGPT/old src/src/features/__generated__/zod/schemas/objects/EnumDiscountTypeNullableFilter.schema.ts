import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { NestedEnumDiscountTypeNullableFilterObjectSchema as NestedEnumDiscountTypeNullableFilterObjectSchema } from './NestedEnumDiscountTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: DiscountTypeSchema.optional().nullable(),
  in: DiscountTypeSchema.array().optional().nullable(),
  notIn: DiscountTypeSchema.array().optional().nullable(),
  not: z.union([DiscountTypeSchema, z.lazy(() => NestedEnumDiscountTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumDiscountTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumDiscountTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumDiscountTypeNullableFilter>;
export const EnumDiscountTypeNullableFilterObjectZodSchema = makeSchema();
