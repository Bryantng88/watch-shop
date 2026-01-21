import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { OrderItemArgsObjectSchema as OrderItemArgsObjectSchema } from './OrderItemArgs.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceCatalogArgsObjectSchema as ServiceCatalogArgsObjectSchema } from './ServiceCatalogArgs.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { OrderItemCountOutputTypeArgsObjectSchema as OrderItemCountOutputTypeArgsObjectSchema } from './OrderItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  orderId: z.boolean().optional(),
  productId: z.boolean().optional(),
  variantId: z.boolean().optional(),
  title: z.boolean().optional(),
  listPrice: z.boolean().optional(),
  discountType: z.boolean().optional(),
  discountValue: z.boolean().optional(),
  unitPriceAgreed: z.boolean().optional(),
  taxRate: z.boolean().optional(),
  quantity: z.boolean().optional(),
  subtotal: z.boolean().optional(),
  img: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  productType: z.boolean().optional(),
  kind: z.boolean().optional(),
  serviceCatalogId: z.boolean().optional(),
  serviceScope: z.boolean().optional(),
  linkedOrderItemId: z.boolean().optional(),
  acquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  OrderItem: z.union([z.boolean(), z.lazy(() => OrderItemArgsObjectSchema)]).optional(),
  other_OrderItem: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  ServiceCatalog: z.union([z.boolean(), z.lazy(() => ServiceCatalogArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => OrderItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const OrderItemSelectObjectSchema: z.ZodType<Prisma.OrderItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemSelect>;
export const OrderItemSelectObjectZodSchema = makeSchema();
