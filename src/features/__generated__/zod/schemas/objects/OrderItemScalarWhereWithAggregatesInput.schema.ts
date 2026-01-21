import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema';
import { Enumdiscount_typeNullableWithAggregatesFilterObjectSchema as Enumdiscount_typeNullableWithAggregatesFilterObjectSchema } from './Enumdiscount_typeNullableWithAggregatesFilter.schema';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumProductTypeNullableWithAggregatesFilterObjectSchema as EnumProductTypeNullableWithAggregatesFilterObjectSchema } from './EnumProductTypeNullableWithAggregatesFilter.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumorderitemkindWithAggregatesFilterObjectSchema as EnumorderitemkindWithAggregatesFilterObjectSchema } from './EnumorderitemkindWithAggregatesFilter.schema';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { Enumservice_scopeNullableWithAggregatesFilterObjectSchema as Enumservice_scopeNullableWithAggregatesFilterObjectSchema } from './Enumservice_scopeNullableWithAggregatesFilter.schema';
import { service_scopeSchema } from '../enums/service_scope.schema'

const orderitemscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  listPrice: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  discountType: z.union([z.lazy(() => Enumdiscount_typeNullableWithAggregatesFilterObjectSchema), discount_typeSchema]).optional().nullable(),
  discountValue: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  unitPriceAgreed: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  taxRate: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  quantity: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  subtotal: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  img: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  productType: z.union([z.lazy(() => EnumProductTypeNullableWithAggregatesFilterObjectSchema), ProductTypeSchema]).optional().nullable(),
  kind: z.union([z.lazy(() => EnumorderitemkindWithAggregatesFilterObjectSchema), orderitemkindSchema]).optional(),
  serviceCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serviceScope: z.union([z.lazy(() => Enumservice_scopeNullableWithAggregatesFilterObjectSchema), service_scopeSchema]).optional().nullable(),
  linkedOrderItemId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const OrderItemScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.OrderItemScalarWhereWithAggregatesInput> = orderitemscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.OrderItemScalarWhereWithAggregatesInput>;
export const OrderItemScalarWhereWithAggregatesInputObjectZodSchema = orderitemscalarwherewithaggregatesinputSchema;
