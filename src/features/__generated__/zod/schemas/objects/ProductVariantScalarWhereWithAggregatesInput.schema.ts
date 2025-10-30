import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { BoolNullableWithAggregatesFilterObjectSchema as BoolNullableWithAggregatesFilterObjectSchema } from './BoolNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumAvailabilityStatusWithAggregatesFilterObjectSchema as EnumAvailabilityStatusWithAggregatesFilterObjectSchema } from './EnumAvailabilityStatusWithAggregatesFilter.schema';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema'

const productvariantscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductVariantScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductVariantScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductVariantScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductVariantScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductVariantScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  sku: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  price: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  stockQty: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  isStockManaged: z.union([z.lazy(() => BoolNullableWithAggregatesFilterObjectSchema), z.boolean()]).optional().nullable(),
  maxQtyPerOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  availabilityStatuts: z.union([z.lazy(() => EnumAvailabilityStatusWithAggregatesFilterObjectSchema), AvailabilityStatusSchema]).optional()
}).strict();
export const ProductVariantScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ProductVariantScalarWhereWithAggregatesInput> = productvariantscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ProductVariantScalarWhereWithAggregatesInput>;
export const ProductVariantScalarWhereWithAggregatesInputObjectZodSchema = productvariantscalarwherewithaggregatesinputSchema;
