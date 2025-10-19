import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumBrandStatusFilterObjectSchema as EnumBrandStatusFilterObjectSchema } from './EnumBrandStatusFilter.schema';
import { BrandStatusSchema } from '../enums/BrandStatus.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductListRelationFilterObjectSchema as ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema'

const brandwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BrandWhereInputObjectSchema), z.lazy(() => BrandWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BrandWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BrandWhereInputObjectSchema), z.lazy(() => BrandWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  country: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  foundedYear: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  website: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  logoUrl: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isAuthorized: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  status: z.union([z.lazy(() => EnumBrandStatusFilterObjectSchema), BrandStatusSchema]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  products: z.lazy(() => ProductListRelationFilterObjectSchema).optional()
}).strict();
export const BrandWhereInputObjectSchema: z.ZodType<Prisma.BrandWhereInput> = brandwhereinputSchema as unknown as z.ZodType<Prisma.BrandWhereInput>;
export const BrandWhereInputObjectZodSchema = brandwhereinputSchema;
