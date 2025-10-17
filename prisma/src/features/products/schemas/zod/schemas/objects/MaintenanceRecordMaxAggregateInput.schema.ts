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
  currency: z.literal(true).optional()
}).strict();
export const MaintenanceRecordMaxAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordMaxAggregateInputType>;
export const MaintenanceRecordMaxAggregateInputObjectZodSchema = makeSchema();
