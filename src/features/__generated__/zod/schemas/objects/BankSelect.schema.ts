import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorFindManySchema as VendorFindManySchema } from '../findManyVendor.schema';
import { BankCountOutputTypeArgsObjectSchema as BankCountOutputTypeArgsObjectSchema } from './BankCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  bankName: z.boolean().optional(),
  Vendor: z.union([z.boolean(), z.lazy(() => VendorFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BankCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BankSelectObjectSchema: z.ZodType<Prisma.BankSelect> = makeSchema() as unknown as z.ZodType<Prisma.BankSelect>;
export const BankSelectObjectZodSchema = makeSchema();
