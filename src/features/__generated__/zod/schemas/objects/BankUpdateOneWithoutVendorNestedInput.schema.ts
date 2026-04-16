import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BankCreateWithoutVendorInputObjectSchema as BankCreateWithoutVendorInputObjectSchema } from './BankCreateWithoutVendorInput.schema';
import { BankUncheckedCreateWithoutVendorInputObjectSchema as BankUncheckedCreateWithoutVendorInputObjectSchema } from './BankUncheckedCreateWithoutVendorInput.schema';
import { BankCreateOrConnectWithoutVendorInputObjectSchema as BankCreateOrConnectWithoutVendorInputObjectSchema } from './BankCreateOrConnectWithoutVendorInput.schema';
import { BankUpsertWithoutVendorInputObjectSchema as BankUpsertWithoutVendorInputObjectSchema } from './BankUpsertWithoutVendorInput.schema';
import { BankWhereInputObjectSchema as BankWhereInputObjectSchema } from './BankWhereInput.schema';
import { BankWhereUniqueInputObjectSchema as BankWhereUniqueInputObjectSchema } from './BankWhereUniqueInput.schema';
import { BankUpdateToOneWithWhereWithoutVendorInputObjectSchema as BankUpdateToOneWithWhereWithoutVendorInputObjectSchema } from './BankUpdateToOneWithWhereWithoutVendorInput.schema';
import { BankUpdateWithoutVendorInputObjectSchema as BankUpdateWithoutVendorInputObjectSchema } from './BankUpdateWithoutVendorInput.schema';
import { BankUncheckedUpdateWithoutVendorInputObjectSchema as BankUncheckedUpdateWithoutVendorInputObjectSchema } from './BankUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BankCreateWithoutVendorInputObjectSchema), z.lazy(() => BankUncheckedCreateWithoutVendorInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BankCreateOrConnectWithoutVendorInputObjectSchema).optional(),
  upsert: z.lazy(() => BankUpsertWithoutVendorInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => BankWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => BankWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => BankWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BankUpdateToOneWithWhereWithoutVendorInputObjectSchema), z.lazy(() => BankUpdateWithoutVendorInputObjectSchema), z.lazy(() => BankUncheckedUpdateWithoutVendorInputObjectSchema)]).optional()
}).strict();
export const BankUpdateOneWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.BankUpdateOneWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BankUpdateOneWithoutVendorNestedInput>;
export const BankUpdateOneWithoutVendorNestedInputObjectZodSchema = makeSchema();
