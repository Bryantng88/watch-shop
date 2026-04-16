import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorScalarWhereInputObjectSchema as VendorScalarWhereInputObjectSchema } from './VendorScalarWhereInput.schema';
import { VendorUpdateManyMutationInputObjectSchema as VendorUpdateManyMutationInputObjectSchema } from './VendorUpdateManyMutationInput.schema';
import { VendorUncheckedUpdateManyWithoutBankInputObjectSchema as VendorUncheckedUpdateManyWithoutBankInputObjectSchema } from './VendorUncheckedUpdateManyWithoutBankInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => VendorUpdateManyMutationInputObjectSchema), z.lazy(() => VendorUncheckedUpdateManyWithoutBankInputObjectSchema)])
}).strict();
export const VendorUpdateManyWithWhereWithoutBankInputObjectSchema: z.ZodType<Prisma.VendorUpdateManyWithWhereWithoutBankInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateManyWithWhereWithoutBankInput>;
export const VendorUpdateManyWithWhereWithoutBankInputObjectZodSchema = makeSchema();
