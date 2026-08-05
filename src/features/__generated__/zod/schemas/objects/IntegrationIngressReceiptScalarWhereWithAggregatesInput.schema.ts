import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const integrationingressreceiptscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => IntegrationIngressReceiptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => IntegrationIngressReceiptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => IntegrationIngressReceiptScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => IntegrationIngressReceiptScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => IntegrationIngressReceiptScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  channel: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  keyId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  nonce: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  eventId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  eventType: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  requestHash: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  responseJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  lastError: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  expiresAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const IntegrationIngressReceiptScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptScalarWhereWithAggregatesInput> = integrationingressreceiptscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.IntegrationIngressReceiptScalarWhereWithAggregatesInput>;
export const IntegrationIngressReceiptScalarWhereWithAggregatesInputObjectZodSchema = integrationingressreceiptscalarwherewithaggregatesinputSchema;
