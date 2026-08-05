import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  keyId: SortOrderSchema.optional(),
  nonce: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  eventType: SortOrderSchema.optional(),
  requestHash: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  lastError: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  expiresAt: SortOrderSchema.optional()
}).strict();
export const IntegrationIngressReceiptMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptMinOrderByAggregateInput>;
export const IntegrationIngressReceiptMinOrderByAggregateInputObjectZodSchema = makeSchema();
