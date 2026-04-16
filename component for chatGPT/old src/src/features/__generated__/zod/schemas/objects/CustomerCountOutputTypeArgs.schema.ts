import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCountOutputTypeSelectObjectSchema as CustomerCountOutputTypeSelectObjectSchema } from './CustomerCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => CustomerCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const CustomerCountOutputTypeArgsObjectSchema = makeSchema();
export const CustomerCountOutputTypeArgsObjectZodSchema = makeSchema();
