import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { EnumDiscountTypeNullableFilterObjectSchema as EnumDiscountTypeNullableFilterObjectSchema } from './EnumDiscountTypeNullableFilter.schema';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumProductTypeNullableFilterObjectSchema as EnumProductTypeNullableFilterObjectSchema } from './EnumProductTypeNullableFilter.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { EnumOrderItemKindFilterObjectSchema as EnumOrderItemKindFilterObjectSchema } from './EnumOrderItemKindFilter.schema';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { EnumServiceScopeNullableFilterObjectSchema as EnumServiceScopeNullableFilterObjectSchema } from './EnumServiceScopeNullableFilter.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { EnumorderflowtypeFilterObjectSchema as EnumorderflowtypeFilterObjectSchema } from './EnumorderflowtypeFilter.schema';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema'

const orderitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  listPrice: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  discountType: z.union([z.lazy(() => EnumDiscountTypeNullableFilterObjectSchema), DiscountTypeSchema]).optional().nullable(),
  discountValue: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  unitPriceAgreed: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  taxRate: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  subtotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  img: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  productType: z.union([z.lazy(() => EnumProductTypeNullableFilterObjectSchema), ProductTypeSchema]).optional().nullable(),
  kind: z.union([z.lazy(() => EnumOrderItemKindFilterObjectSchema), OrderItemKindSchema]).optional(),
  serviceCatalogId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceScope: z.union([z.lazy(() => EnumServiceScopeNullableFilterObjectSchema), ServiceScopeSchema]).optional().nullable(),
  linkedOrderItemId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customerItemNote: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdFromFlow: z.union([z.lazy(() => EnumorderflowtypeFilterObjectSchema), orderflowtypeSchema]).optional()
}).strict();
export const OrderItemScalarWhereInputObjectSchema: z.ZodType<Prisma.OrderItemScalarWhereInput> = orderitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.OrderItemScalarWhereInput>;
export const OrderItemScalarWhereInputObjectZodSchema = orderitemscalarwhereinputSchema;
