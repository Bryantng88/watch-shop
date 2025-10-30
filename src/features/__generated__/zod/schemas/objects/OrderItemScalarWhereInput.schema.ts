import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const orderitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderItemScalarWhereInputObjectSchema), z.lazy(() => OrderItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  listPriceAtOrder: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  discountType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  discountValue: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  unitPriceAgreed: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  taxRate: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  subtotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  img: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const OrderItemScalarWhereInputObjectSchema: z.ZodType<Prisma.OrderItemScalarWhereInput> = orderitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.OrderItemScalarWhereInput>;
export const OrderItemScalarWhereInputObjectZodSchema = orderitemscalarwhereinputSchema;
