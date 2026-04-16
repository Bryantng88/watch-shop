import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumProductCategoryScopeWithAggregatesFilterObjectSchema as EnumProductCategoryScopeWithAggregatesFilterObjectSchema } from './EnumProductCategoryScopeWithAggregatesFilter.schema';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const productcategoryscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductCategoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductCategoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductCategoryScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductCategoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductCategoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  scope: z.union([z.lazy(() => EnumProductCategoryScopeWithAggregatesFilterObjectSchema), ProductCategoryScopeSchema]).optional(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProductCategoryScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ProductCategoryScalarWhereWithAggregatesInput> = productcategoryscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ProductCategoryScalarWhereWithAggregatesInput>;
export const ProductCategoryScalarWhereWithAggregatesInputObjectZodSchema = productcategoryscalarwherewithaggregatesinputSchema;
