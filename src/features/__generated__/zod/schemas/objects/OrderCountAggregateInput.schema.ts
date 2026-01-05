import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  refNo: z.literal(true).optional(),
  customerId: z.literal(true).optional(),
  shipPhone: z.literal(true).optional(),
  shipAddress: z.literal(true).optional(),
  shipWard: z.literal(true).optional(),
  shipCity: z.literal(true).optional(),
  subtotal: z.literal(true).optional(),
  shippingFee: z.literal(true).optional(),
  status: z.literal(true).optional(),
  paymentStatus: z.literal(true).optional(),
  paymentMethod: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  customerName: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  shipDistrict: z.literal(true).optional(),
  hasShipment: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const OrderCountAggregateInputObjectSchema: z.ZodType<Prisma.OrderCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderCountAggregateInputType>;
export const OrderCountAggregateInputObjectZodSchema = makeSchema();
