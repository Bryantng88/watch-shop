import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { service_scopeSchema } from '../enums/service_scope.schema';
import { OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema as OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateNestedOneWithoutOther_OrderItemInput.schema';
import { OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema as OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema } from './OrderItemCreateNestedManyWithoutOrderItemInput.schema';
import { OrderCreateNestedOneWithoutItemsInputObjectSchema as OrderCreateNestedOneWithoutItemsInputObjectSchema } from './OrderCreateNestedOneWithoutItemsInput.schema';
import { ProductCreateNestedOneWithoutOrderItemsInputObjectSchema as ProductCreateNestedOneWithoutOrderItemsInputObjectSchema } from './ProductCreateNestedOneWithoutOrderItemsInput.schema';
import { ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema as ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutOrderItemInput.schema';
import { ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  serviceScope: service_scopeSchema.optional().nullable(),
  OrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema).optional(),
  other_OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputObjectSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema).optional()
}).strict();
export const OrderItemCreateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemCreateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateWithoutAcquisitionItemInput>;
export const OrderItemCreateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
