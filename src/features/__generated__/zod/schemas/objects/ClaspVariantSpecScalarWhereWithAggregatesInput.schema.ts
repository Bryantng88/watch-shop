import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumStrapClaspTypeWithAggregatesFilterObjectSchema as EnumStrapClaspTypeWithAggregatesFilterObjectSchema } from './EnumStrapClaspTypeWithAggregatesFilter.schema';
import { StrapClaspTypeSchema } from '../enums/StrapClaspType.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { EnumStrapOriginTypeWithAggregatesFilterObjectSchema as EnumStrapOriginTypeWithAggregatesFilterObjectSchema } from './EnumStrapOriginTypeWithAggregatesFilter.schema';
import { StrapOriginTypeSchema } from '../enums/StrapOriginType.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const claspvariantspecscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ClaspVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ClaspVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ClaspVariantSpecScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ClaspVariantSpecScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ClaspVariantSpecScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  variantId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  claspType: z.union([z.lazy(() => EnumStrapClaspTypeWithAggregatesFilterObjectSchema), StrapClaspTypeSchema]).optional(),
  widthMM: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  originType: z.union([z.lazy(() => EnumStrapOriginTypeWithAggregatesFilterObjectSchema), StrapOriginTypeSchema]).optional(),
  brandName: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  finish: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  minStockQty: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  targetStockQty: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ClaspVariantSpecScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ClaspVariantSpecScalarWhereWithAggregatesInput> = claspvariantspecscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ClaspVariantSpecScalarWhereWithAggregatesInput>;
export const ClaspVariantSpecScalarWhereWithAggregatesInputObjectZodSchema = claspvariantspecscalarwherewithaggregatesinputSchema;
