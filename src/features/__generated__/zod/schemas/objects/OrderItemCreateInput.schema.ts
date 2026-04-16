import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { DiscountTypeSchema } from '../enums/DiscountType.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { OrderItemKindSchema } from '../enums/OrderItemKind.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { OrderFlowTypeSchema } from '../enums/OrderFlowType.schema';
import { AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectSchema as AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutOrderItemInput.schema';
import { OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema as OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema } from './OrderItemCreateNestedOneWithoutOther_OrderItemInput.schema';
import { OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema as OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema } from './OrderItemCreateNestedManyWithoutOrderItemInput.schema';
import { OrderCreateNestedOneWithoutOrderItemInputObjectSchema as OrderCreateNestedOneWithoutOrderItemInputObjectSchema } from './OrderCreateNestedOneWithoutOrderItemInput.schema';
import { ProductCreateNestedOneWithoutOrderItemInputObjectSchema as ProductCreateNestedOneWithoutOrderItemInputObjectSchema } from './ProductCreateNestedOneWithoutOrderItemInput.schema';
import { ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema as ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutOrderItemInput.schema';
import { ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema as ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
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
  createdFromFlow: OrderFlowTypeSchema.optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutOrderItemInputObjectSchema),
  OrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutOther_OrderItemInputObjectSchema).optional(),
  other_OrderItem: z.lazy(() => OrderItemCreateNestedManyWithoutOrderItemInputObjectSchema),
  Order: z.lazy(() => OrderCreateNestedOneWithoutOrderItemInputObjectSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema)
}).strict();
export const OrderItemCreateInputObjectSchema: z.ZodType<Prisma.OrderItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateInput>;
export const OrderItemCreateInputObjectZodSchema = makeSchema();
