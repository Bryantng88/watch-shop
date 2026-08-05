import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

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
  expiresAt: SortOrderSchema.optional()
}).strict();
export const IntegrationIngressReceiptOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptOrderByWithRelationInput>;
export const IntegrationIngressReceiptOrderByWithRelationInputObjectZodSchema = makeSchema();
