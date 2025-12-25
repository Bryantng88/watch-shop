import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema'

const nestedenumdiscount_typenullablefilterSchema = z.object({
  equals: discount_typeSchema.optional().nullable(),
  in: discount_typeSchema.array().optional().nullable(),
  notIn: discount_typeSchema.array().optional().nullable(),
  not: z.union([discount_typeSchema, z.lazy(() => NestedEnumdiscount_typeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumdiscount_typeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumdiscount_typeNullableFilter> = nestedenumdiscount_typenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumdiscount_typeNullableFilter>;
export const NestedEnumdiscount_typeNullableFilterObjectZodSchema = nestedenumdiscount_typenullablefilterSchema;
