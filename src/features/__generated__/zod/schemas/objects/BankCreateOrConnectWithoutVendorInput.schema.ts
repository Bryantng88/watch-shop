import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './BankWhereUniqueInput.schema';
import { BankCreateWithoutVendorInputObjectSchema as BankCreateWithoutVendorInputObjectSchema } from './BankCreateWithoutVendorInput.schema';
import { BankUncheckedCreateWithoutVendorInputObjectSchema as BankUncheckedCreateWithoutVendorInputObjectSchema } from './BankUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BankWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BankCreateWithoutVendorInputObjectSchema), z.lazy(() => BankUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const BankCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.BankCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.BankCreateOrConnectWithoutVendorInput>;
export const BankCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();
