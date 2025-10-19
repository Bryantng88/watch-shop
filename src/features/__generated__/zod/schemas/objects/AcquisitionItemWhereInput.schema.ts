import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AcquisitionScalarRelationFilterObjectSchema as AcquisitionScalarRelationFilterObjectSchema } from './AcquisitionScalarRelationFilter.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { ProductNullableScalarRelationFilterObjectSchema as ProductNullableScalarRelationFilterObjectSchema } from './ProductNullableScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { OrderItemNullableScalarRelationFilterObjectSchema as OrderItemNullableScalarRelationFilterObjectSchema } from './OrderItemNullableScalarRelationFilter.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { ProductVariantNullableScalarRelationFilterObjectSchema as ProductVariantNullableScalarRelationFilterObjectSchema } from './ProductVariantNullableScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const acquisitionitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionItemWhereInputObjectSchema), z.lazy(() => AcquisitionItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionItemWhereInputObjectSchema), z.lazy(() => AcquisitionItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  unitCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sourceOrderItemId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  acquisition: z.union([z.lazy(() => AcquisitionScalarRelationFilterObjectSchema), z.lazy(() => AcquisitionWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  sourceOrderItem: z.union([z.lazy(() => OrderItemNullableScalarRelationFilterObjectSchema), z.lazy(() => OrderItemWhereInputObjectSchema)]).optional(),
  variant: z.union([z.lazy(() => ProductVariantNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const AcquisitionItemWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionItemWhereInput> = acquisitionitemwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionItemWhereInput>;
export const AcquisitionItemWhereInputObjectZodSchema = acquisitionitemwhereinputSchema;
