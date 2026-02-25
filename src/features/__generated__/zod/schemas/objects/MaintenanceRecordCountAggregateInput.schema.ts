import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  type: z.literal(true).optional(),
  billable: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  variantId: z.literal(true).optional(),
  brandSnapshot: z.literal(true).optional(),
  modelSnapshot: z.literal(true).optional(),
  refSnapshot: z.literal(true).optional(),
  serialSnapshot: z.literal(true).optional(),
  vendorId: z.literal(true).optional(),
  servicedByName: z.literal(true).optional(),
  vendorName: z.literal(true).optional(),
  servicedAt: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  totalCost: z.literal(true).optional(),
  billed: z.literal(true).optional(),
  invoiceId: z.literal(true).optional(),
  revenueAmount: z.literal(true).optional(),
  currency: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  eventType: z.literal(true).optional(),
  prevVendorId: z.literal(true).optional(),
  prevVendorName: z.literal(true).optional(),
  paymentId: z.literal(true).optional(),
  paidAmount: z.literal(true).optional(),
  paidAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const MaintenanceRecordCountAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCountAggregateInputType>;
export const MaintenanceRecordCountAggregateInputObjectZodSchema = makeSchema();
