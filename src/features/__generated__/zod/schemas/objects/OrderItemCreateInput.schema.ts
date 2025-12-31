import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { discount_typeSchema } from '../enums/discount_type.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
import { orderitemkindSchema } from '../enums/orderitemkind.schema';
import { AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema as AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema } from './AcquisitionItemCreateNestedManyWithoutSourceOrderItemInput.schema';
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
  acquisitionItem: z.lazy(() => AcquisitionItemCreateNestedManyWithoutSourceOrderItemInputObjectSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputObjectSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutOrderItemInputObjectSchema).optional(),
  serviceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutOrderItemInputObjectSchema)
}).strict();
export const OrderItemCreateInputObjectSchema: z.ZodType<Prisma.OrderItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateInput>;
export const OrderItemCreateInputObjectZodSchema = makeSchema();
