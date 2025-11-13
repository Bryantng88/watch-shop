import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankSelectObjectSchema as BankSelectObjectSchema } from './BankSelect.schema';
import { BankIncludeObjectSchema as BankIncludeObjectSchema } from './BankInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => BankSelectObjectSchema).optional(),
  include: z.lazy(() => BankIncludeObjectSchema).optional()
}).strict();
export const BankArgsObjectSchema = makeSchema();
export const BankArgsObjectZodSchema = makeSchema();
