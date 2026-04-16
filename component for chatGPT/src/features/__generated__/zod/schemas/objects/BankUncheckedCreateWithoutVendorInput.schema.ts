import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.bigint().optional(),
  created_at: z.coerce.date().optional(),
  bankName: z.string()
}).strict();
export const BankUncheckedCreateWithoutVendorInputObjectSchema: z.ZodType<Prisma.BankUncheckedCreateWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.BankUncheckedCreateWithoutVendorInput>;
export const BankUncheckedCreateWithoutVendorInputObjectZodSchema = makeSchema();
