import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema';
import { NestedEnumProductStatusNullableFilterObjectSchema as NestedEnumProductStatusNullableFilterObjectSchema } from './NestedEnumProductStatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ProductStatusSchema.optional().nullable(),
  in: ProductStatusSchema.array().optional().nullable(),
  notIn: ProductStatusSchema.array().optional().nullable(),
  not: z.union([ProductStatusSchema, z.lazy(() => NestedEnumProductStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumProductStatusNullableFilterObjectSchema: z.ZodType<Prisma.EnumProductStatusNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductStatusNullableFilter>;
export const EnumProductStatusNullableFilterObjectZodSchema = makeSchema();
