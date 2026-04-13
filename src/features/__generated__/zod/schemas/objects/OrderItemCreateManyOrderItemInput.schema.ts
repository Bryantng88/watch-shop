import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  title: z.string(),
  listPrice: z.number(),
  discountType: DiscountTypeSchema.optional().nullable(),
  discountValue: z.number().optional().nullable(),
  unitPriceAgreed: z.number(),
  taxRate: z.number().optional().nullable(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  productType: ProductTypeSchema.optional().nullable(),
  kind: OrderItemKindSchema,
  serviceCatalogId: z.string().optional().nullable(),
  serviceScope: ServiceScopeSchema.optional().nullable(),
  customerItemNote: z.string().optional().nullable(),
  createdFromFlow: orderflowtypeSchema.optional()
}).strict();
export const OrderItemCreateManyOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateManyOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateManyOrderItemInput>;
export const OrderItemCreateManyOrderItemInputObjectZodSchema = makeSchema();
