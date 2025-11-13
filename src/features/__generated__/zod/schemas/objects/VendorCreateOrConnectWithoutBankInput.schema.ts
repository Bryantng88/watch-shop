import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutBankInputObjectSchema as VendorCreateWithoutBankInputObjectSchema } from './VendorCreateWithoutBankInput.schema';
import { VendorUncheckedCreateWithoutBankInputObjectSchema as VendorUncheckedCreateWithoutBankInputObjectSchema } from './VendorUncheckedCreateWithoutBankInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutBankInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutBankInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutBankInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutBankInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutBankInput>;
export const VendorCreateOrConnectWithoutBankInputObjectZodSchema = makeSchema();
