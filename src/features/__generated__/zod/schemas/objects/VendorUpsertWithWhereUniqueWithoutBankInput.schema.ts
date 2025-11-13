import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateWithoutBankInputObjectSchema as VendorUpdateWithoutBankInputObjectSchema } from './VendorUpdateWithoutBankInput.schema';
import { VendorUncheckedUpdateWithoutBankInputObjectSchema as VendorUncheckedUpdateWithoutBankInputObjectSchema } from './VendorUncheckedUpdateWithoutBankInput.schema';
import { VendorCreateWithoutBankInputObjectSchema as VendorCreateWithoutBankInputObjectSchema } from './VendorCreateWithoutBankInput.schema';
import { VendorUncheckedCreateWithoutBankInputObjectSchema as VendorUncheckedCreateWithoutBankInputObjectSchema } from './VendorUncheckedCreateWithoutBankInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => VendorUpdateWithoutBankInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutBankInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutBankInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutBankInputObjectSchema)])
}).strict();
export const VendorUpsertWithWhereUniqueWithoutBankInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithWhereUniqueWithoutBankInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithWhereUniqueWithoutBankInput>;
export const VendorUpsertWithWhereUniqueWithoutBankInputObjectZodSchema = makeSchema();
