import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolNullableFilterObjectSchema as BoolNullableFilterObjectSchema } from './BoolNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumAvailabilityStatusFilterObjectSchema as EnumAvailabilityStatusFilterObjectSchema } from './EnumAvailabilityStatusFilter.schema';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema'

const productvariantscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductVariantScalarWhereInputObjectSchema), z.lazy(() => ProductVariantScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductVariantScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductVariantScalarWhereInputObjectSchema), z.lazy(() => ProductVariantScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sku: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  price: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  stockQty: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  isStockManaged: z.union([z.lazy(() => BoolNullableFilterObjectSchema), z.boolean()]).optional().nullable(),
  maxQtyPerOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  availabilityStatuts: z.union([z.lazy(() => EnumAvailabilityStatusFilterObjectSchema), AvailabilityStatusSchema]).optional()
}).strict();
export const ProductVariantScalarWhereInputObjectSchema: z.ZodType<Prisma.ProductVariantScalarWhereInput> = productvariantscalarwhereinputSchema as unknown as z.ZodType<Prisma.ProductVariantScalarWhereInput>;
export const ProductVariantScalarWhereInputObjectZodSchema = productvariantscalarwhereinputSchema;
