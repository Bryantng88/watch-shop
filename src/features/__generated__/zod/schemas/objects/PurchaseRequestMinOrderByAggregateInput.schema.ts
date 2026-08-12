import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  reference: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  outcome: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  externalRequestId: SortOrderSchema.optional(),
  requestKey: SortOrderSchema.optional(),
  requestHash: SortOrderSchema.optional(),
  fingerprintHash: SortOrderSchema.optional(),
  customerName: SortOrderSchema.optional(),
  phone: SortOrderSchema.optional(),
  normalizedPhone: SortOrderSchema.optional(),
  contactPreference: SortOrderSchema.optional(),
  contactHandle: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  city: SortOrderSchema.optional(),
  district: SortOrderSchema.optional(),
  ward: SortOrderSchema.optional(),
  customerNote: SortOrderSchema.optional(),
  processingNote: SortOrderSchema.optional(),
  completionReason: SortOrderSchema.optional(),
  assignedUserId: SortOrderSchema.optional(),
  followUpAt: SortOrderSchema.optional(),
  processingStartedAt: SortOrderSchema.optional(),
  completedAt: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestMinOrderByAggregateInput>;
export const PurchaseRequestMinOrderByAggregateInputObjectZodSchema = makeSchema();
