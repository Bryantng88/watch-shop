import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankCreateWithoutVendorInputObjectSchema as BankCreateWithoutVendorInputObjectSchema } from './BankCreateWithoutVendorInput.schema';
import { BankUncheckedCreateWithoutVendorInputObjectSchema as BankUncheckedCreateWithoutVendorInputObjectSchema } from './BankUncheckedCreateWithoutVendorInput.schema';
import { BankCreateOrConnectWithoutVendorInputObjectSchema as BankCreateOrConnectWithoutVendorInputObjectSchema } from './BankCreateOrConnectWithoutVendorInput.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './BankWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BankCreateWithoutVendorInputObjectSchema), z.lazy(() => BankUncheckedCreateWithoutVendorInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BankCreateOrConnectWithoutVendorInputObjectSchema).optional(),
  connect: z.lazy(() => BankWhereUniqueInputObjectSchema).optional()
}).strict();
export const BankCreateNestedOneWithoutVendorInputObjectSchema: z.ZodType<Prisma.BankCreateNestedOneWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.BankCreateNestedOneWithoutVendorInput>;
export const BankCreateNestedOneWithoutVendorInputObjectZodSchema = makeSchema();
