import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutBankInputObjectSchema as VendorCreateWithoutBankInputObjectSchema } from './VendorCreateWithoutBankInput.schema';
import { VendorUncheckedCreateWithoutBankInputObjectSchema as VendorUncheckedCreateWithoutBankInputObjectSchema } from './VendorUncheckedCreateWithoutBankInput.schema';
import { VendorCreateOrConnectWithoutBankInputObjectSchema as VendorCreateOrConnectWithoutBankInputObjectSchema } from './VendorCreateOrConnectWithoutBankInput.schema';
import { VendorCreateManyBankInputEnvelopeObjectSchema as VendorCreateManyBankInputEnvelopeObjectSchema } from './VendorCreateManyBankInputEnvelope.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutBankInputObjectSchema), z.lazy(() => VendorCreateWithoutBankInputObjectSchema).array(), z.lazy(() => VendorUncheckedCreateWithoutBankInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutBankInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => VendorCreateOrConnectWithoutBankInputObjectSchema), z.lazy(() => VendorCreateOrConnectWithoutBankInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => VendorCreateManyBankInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => VendorWhereUniqueInputObjectSchema), z.lazy(() => VendorWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const VendorCreateNestedManyWithoutBankInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedManyWithoutBankInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedManyWithoutBankInput>;
export const VendorCreateNestedManyWithoutBankInputObjectZodSchema = makeSchema();
