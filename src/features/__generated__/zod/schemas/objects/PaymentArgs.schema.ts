import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentSelectObjectSchema as PaymentSelectObjectSchema } from './PaymentSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PaymentSelectObjectSchema).optional()
}).strict();
export const PaymentArgsObjectSchema = makeSchema();
export const PaymentArgsObjectZodSchema = makeSchema();
