import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const integrationingressreceiptwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => IntegrationIngressReceiptWhereInputObjectSchema), z.lazy(() => IntegrationIngressReceiptWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => IntegrationIngressReceiptWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => IntegrationIngressReceiptWhereInputObjectSchema), z.lazy(() => IntegrationIngressReceiptWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  channel: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  keyId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  nonce: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  requestHash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  responseJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  lastError: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  expiresAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const IntegrationIngressReceiptWhereInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptWhereInput> = integrationingressreceiptwhereinputSchema as unknown as z.ZodType<Prisma.IntegrationIngressReceiptWhereInput>;
export const IntegrationIngressReceiptWhereInputObjectZodSchema = integrationingressreceiptwhereinputSchema;
