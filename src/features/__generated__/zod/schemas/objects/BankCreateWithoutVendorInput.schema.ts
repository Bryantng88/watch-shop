import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.bigint().optional(),
  created_at: z.coerce.date().optional(),
  bankName: z.string()
}).strict();
export const BankCreateWithoutVendorInputObjectSchema: z.ZodType<Prisma.BankCreateWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.BankCreateWithoutVendorInput>;
export const BankCreateWithoutVendorInputObjectZodSchema = makeSchema();
