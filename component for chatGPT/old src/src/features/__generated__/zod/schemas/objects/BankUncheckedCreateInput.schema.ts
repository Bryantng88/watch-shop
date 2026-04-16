import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUncheckedCreateNestedManyWithoutBankInputObjectSchema as VendorUncheckedCreateNestedManyWithoutBankInputObjectSchema } from './VendorUncheckedCreateNestedManyWithoutBankInput.schema'

const makeSchema = () => z.object({
  id: z.bigint().optional(),
  created_at: z.coerce.date().optional(),
  bankName: z.string(),
  Vendor: z.lazy(() => VendorUncheckedCreateNestedManyWithoutBankInputObjectSchema)
}).strict();
export const BankUncheckedCreateInputObjectSchema: z.ZodType<Prisma.BankUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BankUncheckedCreateInput>;
export const BankUncheckedCreateInputObjectZodSchema = makeSchema();
