import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankCountOutputTypeSelectObjectSchema as BankCountOutputTypeSelectObjectSchema } from './BankCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BankCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const BankCountOutputTypeArgsObjectSchema = makeSchema();
export const BankCountOutputTypeArgsObjectZodSchema = makeSchema();
