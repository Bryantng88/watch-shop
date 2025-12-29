import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductTypeSchema } from '../enums/ProductType.schema'

const nestedenumproducttypenullablefilterSchema = z.object({
  equals: ProductTypeSchema.optional().nullable(),
  in: ProductTypeSchema.array().optional().nullable(),
  notIn: ProductTypeSchema.array().optional().nullable(),
  not: z.union([ProductTypeSchema, z.lazy(() => NestedEnumProductTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumProductTypeNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductTypeNullableFilter> = nestedenumproducttypenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductTypeNullableFilter>;
export const NestedEnumProductTypeNullableFilterObjectZodSchema = nestedenumproducttypenullablefilterSchema;
