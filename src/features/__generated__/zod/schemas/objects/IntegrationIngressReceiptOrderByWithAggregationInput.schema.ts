import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { IntegrationIngressReceiptCountOrderByAggregateInputObjectSchema as IntegrationIngressReceiptCountOrderByAggregateInputObjectSchema } from './IntegrationIngressReceiptCountOrderByAggregateInput.schema';
import { IntegrationIngressReceiptMaxOrderByAggregateInputObjectSchema as IntegrationIngressReceiptMaxOrderByAggregateInputObjectSchema } from './IntegrationIngressReceiptMaxOrderByAggregateInput.schema';
import { IntegrationIngressReceiptMinOrderByAggregateInputObjectSchema as IntegrationIngressReceiptMinOrderByAggregateInputObjectSchema } from './IntegrationIngressReceiptMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  keyId: SortOrderSchema.optional(),
  nonce: SortOrderSchema.optional(),
  eventId: SortOrderSchema.optional(),
  eventType: SortOrderSchema.optional(),
  requestHash: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  responseJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  lastError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  expiresAt: SortOrderSchema.optional(),
  _count: z.lazy(() => IntegrationIngressReceiptCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => IntegrationIngressReceiptMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => IntegrationIngressReceiptMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const IntegrationIngressReceiptOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptOrderByWithAggregationInput>;
export const IntegrationIngressReceiptOrderByWithAggregationInputObjectZodSchema = makeSchema();
