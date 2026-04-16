import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { ShipmentArgsObjectSchema as ShipmentArgsObjectSchema } from './ShipmentArgs.schema';
import { OrderCountOutputTypeArgsObjectSchema as OrderCountOutputTypeArgsObjectSchema } from './OrderCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  items: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  Shipment: z.union([z.boolean(), z.lazy(() => ShipmentArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const OrderIncludeObjectSchema: z.ZodType<Prisma.OrderInclude> = makeSchema() as unknown as z.ZodType<Prisma.OrderInclude>;
export const OrderIncludeObjectZodSchema = makeSchema();
