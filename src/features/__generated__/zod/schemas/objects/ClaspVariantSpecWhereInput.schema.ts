import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumStrapClaspTypeFilterObjectSchema as EnumStrapClaspTypeFilterObjectSchema } from './EnumStrapClaspTypeFilter.schema';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { EnumStrapOriginTypeFilterObjectSchema as EnumStrapOriginTypeFilterObjectSchema } from './EnumStrapOriginTypeFilter.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductVariantScalarRelationFilterObjectSchema as ProductVariantScalarRelationFilterObjectSchema } from './ProductVariantScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const claspvariantspecwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ClaspVariantSpecWhereInputObjectSchema), z.lazy(() => ClaspVariantSpecWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClaspVariantSpecWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClaspVariantSpecWhereInputObjectSchema), z.lazy(() => ClaspVariantSpecWhereInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  claspType: z.union([z.lazy(() => EnumStrapClaspTypeFilterObjectSchema), StrapClaspTypeSchema]).optional(),
  widthMM: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  originType: z.union([z.lazy(() => EnumStrapOriginTypeFilterObjectSchema), StrapOriginTypeSchema]).optional(),
  brandName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  finish: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  minStockQty: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  targetStockQty: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  ProductVariant: z.union([z.lazy(() => ProductVariantScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const ClaspVariantSpecWhereInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecWhereInput> = claspvariantspecwhereinputSchema as unknown as z.ZodType<Prisma.ClaspVariantSpecWhereInput>;
export const ClaspVariantSpecWhereInputObjectZodSchema = claspvariantspecwhereinputSchema;
