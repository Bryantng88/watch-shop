import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  orderId: z.boolean().optional(),
  shipPhone: z.boolean().optional(),
  shipAddress: z.boolean().optional(),
  shipCity: z.boolean().optional(),
  shipDistrict: z.boolean().optional(),
  shipWard: z.boolean().optional(),
  carrier: z.boolean().optional(),
  trackingCode: z.boolean().optional(),
  shippingFee: z.boolean().optional(),
  currency: z.boolean().optional(),
  shippedAt: z.boolean().optional(),
  deliveredAt: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  status: z.boolean().optional(),
  refNo: z.boolean().optional(),
  Order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional()
}).strict();
export const ShipmentSelectObjectSchema: z.ZodType<Prisma.ShipmentSelect> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentSelect>;
export const ShipmentSelectObjectZodSchema = makeSchema();
