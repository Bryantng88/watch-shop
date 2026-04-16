import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { orderflowtypeSchema } from '../enums/orderflowtype.schema';
import { AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutSourceOrderItemInput.schema';
import { OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema as OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateNestedOneWithoutOther_OrderItemInput.schema';
import { OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema as OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema } from './OrderItemCreateNestedManyWithoutOrderItemInput.schema';
import { OrderCreateNestedOneWithoutItemsInputObjectSchema as OrderCreateNestedOneWithoutItemsInputObjectSchema } from './OrderCreateNestedOneWithoutItemsInput.schema';
import { ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema as ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutOrderItemInput.schema';
import { ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  serviceScope: ServiceScopeSchema.optional().nullable(),
  customerItemNote: z.string().optional().nullable(),
  createdFromFlow: orderflowtypeSchema.optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema).optional(),
  OrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema).optional(),
  other_OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputObjectSchema),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateWithoutProductInput>;
export const OrderItemCreateWithoutProductInputObjectZodSchema = makeSchema();
