import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  channel: z.string(),
  keyId: z.string(),
  nonce: z.string(),
  eventId: z.string(),
  eventType: z.string(),
  requestHash: z.string(),
  status: z.string(),
  responseJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  lastError: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date()
}).strict();
export const IntegrationIngressReceiptCreateInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptCreateInput>;
export const IntegrationIngressReceiptCreateInputObjectZodSchema = makeSchema();
