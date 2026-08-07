import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  reference: z.literal(true).optional(),
  status: z.literal(true).optional(),
  outcome: z.literal(true).optional(),
  channel: z.literal(true).optional(),
  externalRequestId: z.literal(true).optional(),
  requestKey: z.literal(true).optional(),
  requestHash: z.literal(true).optional(),
  fingerprintHash: z.literal(true).optional(),
  customerName: z.literal(true).optional(),
  phone: z.literal(true).optional(),
  contactPreference: z.literal(true).optional(),
  address: z.literal(true).optional(),
  city: z.literal(true).optional(),
  district: z.literal(true).optional(),
  ward: z.literal(true).optional(),
  customerNote: z.literal(true).optional(),
  processingNote: z.literal(true).optional(),
  completionReason: z.literal(true).optional(),
  assignedUserId: z.literal(true).optional(),
  followUpAt: z.literal(true).optional(),
  processingStartedAt: z.literal(true).optional(),
  completedAt: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const PurchaseRequestMaxAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestMaxAggregateInputType>;
export const PurchaseRequestMaxAggregateInputObjectZodSchema = makeSchema();
