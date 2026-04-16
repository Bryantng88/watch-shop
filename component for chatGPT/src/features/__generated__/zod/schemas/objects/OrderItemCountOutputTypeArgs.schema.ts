import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCountOutputTypeSelectObjectSchema as OrderItemCountOutputTypeSelectObjectSchema } from './OrderItemCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => OrderItemCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const OrderItemCountOutputTypeArgsObjectSchema = makeSchema();
export const OrderItemCountOutputTypeArgsObjectZodSchema = makeSchema();
