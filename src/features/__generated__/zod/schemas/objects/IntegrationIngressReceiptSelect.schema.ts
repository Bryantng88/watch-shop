import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  channel: z.boolean().optional(),
  keyId: z.boolean().optional(),
  nonce: z.boolean().optional(),
  eventId: z.boolean().optional(),
  eventType: z.boolean().optional(),
  requestHash: z.boolean().optional(),
  status: z.boolean().optional(),
  responseJson: z.boolean().optional(),
  lastError: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  expiresAt: z.boolean().optional()
}).strict();
export const IntegrationIngressReceiptSelectObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptSelect> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptSelect>;
export const IntegrationIngressReceiptSelectObjectZodSchema = makeSchema();
