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
export const IntegrationIngressReceiptMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptMaxOrderByAggregateInput>;
export const IntegrationIngressReceiptMaxOrderByAggregateInputObjectZodSchema = makeSchema();
