import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorFindManySchema as VendorFindManySchema } from '../findManyVendor.schema';
import { BankCountOutputTypeArgsObjectSchema as BankCountOutputTypeArgsObjectSchema } from './BankCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  Vendor: z.union([z.boolean(), z.lazy(() => VendorFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BankCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BankIncludeObjectSchema: z.ZodType<Prisma.BankInclude> = makeSchema() as unknown as z.ZodType<Prisma.BankInclude>;
export const BankIncludeObjectZodSchema = makeSchema();
