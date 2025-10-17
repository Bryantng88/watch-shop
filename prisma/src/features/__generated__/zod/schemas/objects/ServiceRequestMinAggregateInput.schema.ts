import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  billable: z.literal(true).optional(),
  orderItemId: z.literal(true).optional(),
  customerId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  variantId: z.literal(true).optional(),
  brandSnapshot: z.literal(true).optional(),
  modelSnapshot: z.literal(true).optional(),
  refSnapshot: z.literal(true).optional(),
  serialSnapshot: z.literal(true).optional(),
  appointmentAt: z.literal(true).optional(),
  status: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  warrantyUntil: z.literal(true).optional(),
  warrantyPolicy: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ServiceRequestMinAggregateInputObjectSchema: z.ZodType<Prisma.ServiceRequestMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestMinAggregateInputType>;
export const ServiceRequestMinAggregateInputObjectZodSchema = makeSchema();
