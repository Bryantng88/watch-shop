import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { IntegrationIngressReceiptSelectObjectSchema as IntegrationIngressReceiptSelectObjectSchema } from './IntegrationIngressReceiptSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => IntegrationIngressReceiptSelectObjectSchema).optional()
}).strict();
export const IntegrationIngressReceiptArgsObjectSchema = makeSchema();
export const IntegrationIngressReceiptArgsObjectZodSchema = makeSchema();
