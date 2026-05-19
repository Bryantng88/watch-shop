import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductStatusSchema } from '../enums/ProductStatus.schema'

const nestedenumproductstatusnullablefilterSchema = z.object({
  equals: ProductStatusSchema.optional().nullable(),
  in: ProductStatusSchema.array().optional().nullable(),
  notIn: ProductStatusSchema.array().optional().nullable(),
  not: z.union([ProductStatusSchema, z.lazy(() => NestedEnumProductStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumProductStatusNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductStatusNullableFilter> = nestedenumproductstatusnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductStatusNullableFilter>;
export const NestedEnumProductStatusNullableFilterObjectZodSchema = nestedenumproductstatusnullablefilterSchema;
