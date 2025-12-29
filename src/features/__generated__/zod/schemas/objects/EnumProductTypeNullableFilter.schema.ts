import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { NestedEnumProductTypeNullableFilterObjectSchema as NestedEnumProductTypeNullableFilterObjectSchema } from './NestedEnumProductTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ProductTypeSchema.optional().nullable(),
  in: ProductTypeSchema.array().optional().nullable(),
  notIn: ProductTypeSchema.array().optional().nullable(),
  not: z.union([ProductTypeSchema, z.lazy(() => NestedEnumProductTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumProductTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumProductTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductTypeNullableFilter>;
export const EnumProductTypeNullableFilterObjectZodSchema = makeSchema();
