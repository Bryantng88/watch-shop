import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumProductCategoryScopeFilterObjectSchema as EnumProductCategoryScopeFilterObjectSchema } from './EnumProductCategoryScopeFilter.schema';
import { ProductCategoryScopeSchema } from '../enums/ProductCategoryScope.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductListRelationFilterObjectSchema as ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema'

const productcategorywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductCategoryWhereInputObjectSchema), z.lazy(() => ProductCategoryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductCategoryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductCategoryWhereInputObjectSchema), z.lazy(() => ProductCategoryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  scope: z.union([z.lazy(() => EnumProductCategoryScopeFilterObjectSchema), ProductCategoryScopeSchema]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  Product: z.lazy(() => ProductListRelationFilterObjectSchema).optional()
}).strict();
export const ProductCategoryWhereInputObjectSchema: z.ZodType<Prisma.ProductCategoryWhereInput> = productcategorywhereinputSchema as unknown as z.ZodType<Prisma.ProductCategoryWhereInput>;
export const ProductCategoryWhereInputObjectZodSchema = productcategorywhereinputSchema;
