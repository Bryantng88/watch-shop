import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankUpdateWithoutVendorInputObjectSchema as BankUpdateWithoutVendorInputObjectSchema } from './BankUpdateWithoutVendorInput.schema';
import { BankUncheckedUpdateWithoutVendorInputObjectSchema as BankUncheckedUpdateWithoutVendorInputObjectSchema } from './BankUncheckedUpdateWithoutVendorInput.schema';
import { BankCreateWithoutVendorInputObjectSchema as BankCreateWithoutVendorInputObjectSchema } from './BankCreateWithoutVendorInput.schema';
import { BankUncheckedCreateWithoutVendorInputObjectSchema as BankUncheckedCreateWithoutVendorInputObjectSchema } from './BankUncheckedCreateWithoutVendorInput.schema';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './BankWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => BankUpdateWithoutVendorInputObjectSchema), z.lazy(() => BankUncheckedUpdateWithoutVendorInputObjectSchema)]),
  create: z.union([z.lazy(() => BankCreateWithoutVendorInputObjectSchema), z.lazy(() => BankUncheckedCreateWithoutVendorInputObjectSchema)]),
  where: z.lazy(() => BankWhereInputObjectSchema).optional()
}).strict();
export const BankUpsertWithoutVendorInputObjectSchema: z.ZodType<Prisma.BankUpsertWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.BankUpsertWithoutVendorInput>;
export const BankUpsertWithoutVendorInputObjectZodSchema = makeSchema();
