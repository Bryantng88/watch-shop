import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { OrderItemCountOutputTypeArgsObjectSchema as OrderItemCountOutputTypeArgsObjectSchema } from './OrderItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  orderId: z.boolean().optional(),
  productId: z.boolean().optional(),
  variantId: z.boolean().optional(),
  title: z.boolean().optional(),
  listPriceAtOrder: z.boolean().optional(),
  discountType: z.boolean().optional(),
  discountValue: z.boolean().optional(),
  unitPriceAgreed: z.boolean().optional(),
  taxRate: z.boolean().optional(),
  quantity: z.boolean().optional(),
  subtotal: z.boolean().optional(),
  img: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  acquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => OrderItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const OrderItemSelectObjectSchema: z.ZodType<Prisma.OrderItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemSelect>;
export const OrderItemSelectObjectZodSchema = makeSchema();
