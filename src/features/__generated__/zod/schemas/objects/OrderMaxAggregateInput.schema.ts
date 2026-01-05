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
  reservetype: z.literal(true).optional(),
  reserveuntil: z.literal(true).optional(),
  depositqequired: z.literal(true).optional(),
  depositpaid: z.literal(true).optional()
}).strict();
export const OrderMaxAggregateInputObjectSchema: z.ZodType<Prisma.OrderMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderMaxAggregateInputType>;
export const OrderMaxAggregateInputObjectZodSchema = makeSchema();
