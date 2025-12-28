import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { OrderCountOutputTypeArgsObjectSchema as OrderCountOutputTypeArgsObjectSchema } from './OrderCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  refNo: z.boolean().optional(),
  customerId: z.boolean().optional(),
  shipPhone: z.boolean().optional(),
  shipAddress: z.boolean().optional(),
  shipWard: z.boolean().optional(),
  shipCity: z.boolean().optional(),
  subtotal: z.boolean().optional(),
  shippingFee: z.boolean().optional(),
  status: z.boolean().optional(),
  paymentStatus: z.boolean().optional(),
  paymentMethod: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  customerName: z.boolean().optional(),
  notes: z.boolean().optional(),
  shipDistrict: z.boolean().optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  items: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const OrderSelectObjectSchema: z.ZodType<Prisma.OrderSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderSelect>;
export const OrderSelectObjectZodSchema = makeSchema();
