import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './BankWhereInput.schema';
import { BankUpdateWithoutVendorInputObjectSchema as BankUpdateWithoutVendorInputObjectSchema } from './BankUpdateWithoutVendorInput.schema';
import { BankUncheckedUpdateWithoutVendorInputObjectSchema as BankUncheckedUpdateWithoutVendorInputObjectSchema } from './BankUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BankWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BankUpdateWithoutVendorInputObjectSchema), z.lazy(() => BankUncheckedUpdateWithoutVendorInputObjectSchema)])
}).strict();
export const BankUpdateToOneWithWhereWithoutVendorInputObjectSchema: z.ZodType<Prisma.BankUpdateToOneWithWhereWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.BankUpdateToOneWithWhereWithoutVendorInput>;
export const BankUpdateToOneWithWhereWithoutVendorInputObjectZodSchema = makeSchema();
