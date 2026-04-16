import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema';
import { NestedEnumProductCategoryScopeFilterObjectSchema as NestedEnumProductCategoryScopeFilterObjectSchema } from './NestedEnumProductCategoryScopeFilter.schema'

const makeSchema = () => z.object({
  equals: ProductCategoryScopeSchema.optional(),
  in: ProductCategoryScopeSchema.array().optional(),
  notIn: ProductCategoryScopeSchema.array().optional(),
  not: z.union([ProductCategoryScopeSchema, z.lazy(() => NestedEnumProductCategoryScopeFilterObjectSchema)]).optional()
}).strict();
export const EnumProductCategoryScopeFilterObjectSchema: z.ZodType<Prisma.EnumProductCategoryScopeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumProductCategoryScopeFilter>;
export const EnumProductCategoryScopeFilterObjectZodSchema = makeSchema();
