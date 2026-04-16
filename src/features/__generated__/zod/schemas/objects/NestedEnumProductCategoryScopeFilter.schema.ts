import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema'

const nestedenumproductcategoryscopefilterSchema = z.object({
  equals: ProductCategoryScopeSchema.optional(),
  in: ProductCategoryScopeSchema.array().optional(),
  notIn: ProductCategoryScopeSchema.array().optional(),
  not: z.union([ProductCategoryScopeSchema, z.lazy(() => NestedEnumProductCategoryScopeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumProductCategoryScopeFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductCategoryScopeFilter> = nestedenumproductcategoryscopefilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductCategoryScopeFilter>;
export const NestedEnumProductCategoryScopeFilterObjectZodSchema = nestedenumproductcategoryscopefilterSchema;
