import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  productId: z.string().optional().nullable(),
  variantId: z.string().optional().nullable(),
  title: z.string(),
  listPrice: z.number(),
  discountType: discount_typeSchema.optional().nullable(),
  discountValue: z.number().optional().nullable(),
  unitPriceAgreed: z.number(),
  taxRate: z.number().optional().nullable(),
  quantity: z.number().int(),
  subtotal: z.number(),
  img: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  productType: ProductTypeSchema.optional().nullable(),
  kind: orderitemkindSchema,
  serviceCatalogId: z.string().optional().nullable(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedCreateWithoutAcquisitionItemInput>;
export const OrderItemUncheckedCreateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
