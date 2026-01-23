import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInput.schema';
import { OrderItemUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema as OrderItemUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedCreateNestedManyWithoutOrderItemInput.schema';
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
  serviceScope: ServiceScopeSchema.optional().nullable(),
  linkedOrderItemId: z.string().optional().nullable(),
  customerItemNote: z.string().optional().nullable(),
  acquisitionItem: z.lazy(() => AcquisitionItemUncheckedCreateNestedManyWithoutSourceOrderItemInputObjectSchema).optional(),
  other_OrderItem: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemUncheckedCreateWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUncheckedCreateWithoutServiceCatalogInput>;
export const OrderItemUncheckedCreateWithoutServiceCatalogInputObjectZodSchema = makeSchema();
