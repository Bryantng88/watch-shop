import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCountOutputTypeSelectObjectSchema as PaymentCountOutputTypeSelectObjectSchema } from './PaymentCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PaymentCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const PaymentCountOutputTypeArgsObjectSchema = makeSchema();
export const PaymentCountOutputTypeArgsObjectZodSchema = makeSchema();
