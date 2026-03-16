import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumProductCategoryScopeFilterObjectSchema as NestedEnumProductCategoryScopeFilterObjectSchema } from './NestedEnumProductCategoryScopeFilter.schema'

const nestedenumproductcategoryscopewithaggregatesfilterSchema = z.object({
  equals: ProductCategoryScopeSchema.optional(),
  in: ProductCategoryScopeSchema.array().optional(),
  notIn: ProductCategoryScopeSchema.array().optional(),
  not: z.union([ProductCategoryScopeSchema, z.lazy(() => NestedEnumProductCategoryScopeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumProductCategoryScopeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumProductCategoryScopeFilterObjectSchema).optional()
}).strict();
export const NestedEnumProductCategoryScopeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumProductCategoryScopeWithAggregatesFilter> = nestedenumproductcategoryscopewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumProductCategoryScopeWithAggregatesFilter>;
export const NestedEnumProductCategoryScopeWithAggregatesFilterObjectZodSchema = nestedenumproductcategoryscopewithaggregatesfilterSchema;
