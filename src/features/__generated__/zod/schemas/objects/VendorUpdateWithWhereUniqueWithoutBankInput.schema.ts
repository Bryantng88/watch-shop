import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateWithoutBankInputObjectSchema as VendorUpdateWithoutBankInputObjectSchema } from './VendorUpdateWithoutBankInput.schema';
import { VendorUncheckedUpdateWithoutBankInputObjectSchema as VendorUncheckedUpdateWithoutBankInputObjectSchema } from './VendorUncheckedUpdateWithoutBankInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => VendorUpdateWithoutBankInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutBankInputObjectSchema)])
}).strict();
export const VendorUpdateWithWhereUniqueWithoutBankInputObjectSchema: z.ZodType<Prisma.VendorUpdateWithWhereUniqueWithoutBankInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateWithWhereUniqueWithoutBankInput>;
export const VendorUpdateWithWhereUniqueWithoutBankInputObjectZodSchema = makeSchema();
