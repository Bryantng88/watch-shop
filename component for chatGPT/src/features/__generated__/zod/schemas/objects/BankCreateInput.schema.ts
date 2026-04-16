import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateNestedManyWithoutBankInputObjectSchema as VendorCreateNestedManyWithoutBankInputObjectSchema } from './VendorCreateNestedManyWithoutBankInput.schema'

const makeSchema = () => z.object({
  id: z.bigint().optional(),
  created_at: z.coerce.date().optional(),
  bankName: z.string(),
  Vendor: z.lazy(() => VendorCreateNestedManyWithoutBankInputObjectSchema)
}).strict();
export const BankCreateInputObjectSchema: z.ZodType<Prisma.BankCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BankCreateInput>;
export const BankCreateInputObjectZodSchema = makeSchema();
