import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { NestedEnumdiscount_typeNullableFilterObjectSchema as NestedEnumdiscount_typeNullableFilterObjectSchema } from './NestedEnumdiscount_typeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: discount_typeSchema.optional().nullable(),
  in: discount_typeSchema.array().optional().nullable(),
  notIn: discount_typeSchema.array().optional().nullable(),
  not: z.union([discount_typeSchema, z.lazy(() => NestedEnumdiscount_typeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const Enumdiscount_typeNullableFilterObjectSchema: z.ZodType<Prisma.Enumdiscount_typeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.Enumdiscount_typeNullableFilter>;
export const Enumdiscount_typeNullableFilterObjectZodSchema = makeSchema();
