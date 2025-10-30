import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumContentStatusFilterObjectSchema as EnumContentStatusFilterObjectSchema } from './EnumContentStatusFilter.schema';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { EnumProductTypeFilterObjectSchema as EnumProductTypeFilterObjectSchema } from './EnumProductTypeFilter.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumPriceVisibilityFilterObjectSchema as EnumPriceVisibilityFilterObjectSchema } from './EnumPriceVisibilityFilter.schema';
import { PriceVisibilitySchema } from '../enums/PriceVisibility.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumTagFilterObjectSchema as EnumTagFilterObjectSchema } from './EnumTagFilter.schema';
import { TagSchema } from '../enums/Tag.schema'

const productscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  primaryImageUrl: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  contentStatus: z.union([z.lazy(() => EnumContentStatusFilterObjectSchema), ContentStatusSchema]).optional(),
  type: z.union([z.lazy(() => EnumProductTypeFilterObjectSchema), ProductTypeSchema]).optional(),
  priceVisibility: z.union([z.lazy(() => EnumPriceVisibilityFilterObjectSchema), PriceVisibilitySchema]).optional(),
  brandId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  seoTitle: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  seoDescription: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isStockManaged: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  maxQtyPerOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  publishedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  tag: z.union([z.lazy(() => EnumTagFilterObjectSchema), TagSchema]).optional()
}).strict();
export const ProductScalarWhereInputObjectSchema: z.ZodType<Prisma.ProductScalarWhereInput> = productscalarwhereinputSchema as unknown as z.ZodType<Prisma.ProductScalarWhereInput>;
export const ProductScalarWhereInputObjectZodSchema = productscalarwhereinputSchema;
