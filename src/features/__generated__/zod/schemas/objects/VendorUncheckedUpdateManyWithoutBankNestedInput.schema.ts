import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutBankInputObjectSchema as VendorCreateWithoutBankInputObjectSchema } from './VendorCreateWithoutBankInput.schema';
import { VendorUncheckedCreateWithoutBankInputObjectSchema as VendorUncheckedCreateWithoutBankInputObjectSchema } from './VendorUncheckedCreateWithoutBankInput.schema';
import { VendorCreateOrConnectWithoutBankInputObjectSchema as VendorCreateOrConnectWithoutBankInputObjectSchema } from './VendorCreateOrConnectWithoutBankInput.schema';
import { VendorUpsertWithWhereUniqueWithoutBankInputObjectSchema as VendorUpsertWithWhereUniqueWithoutBankInputObjectSchema } from './VendorUpsertWithWhereUniqueWithoutBankInput.schema';
import { VendorCreateManyBankInputEnvelopeObjectSchema as VendorCreateManyBankInputEnvelopeObjectSchema } from './VendorCreateManyBankInputEnvelope.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateWithWhereUniqueWithoutBankInputObjectSchema as VendorUpdateWithWhereUniqueWithoutBankInputObjectSchema } from './VendorUpdateWithWhereUniqueWithoutBankInput.schema';
import { VendorUpdateManyWithWhereWithoutBankInputObjectSchema as VendorUpdateManyWithWhereWithoutBankInputObjectSchema } from './VendorUpdateManyWithWhereWithoutBankInput.schema';
import { VendorScalarWhereInputObjectSchema as VendorScalarWhereInputObjectSchema } from './VendorScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutBankInputObjectSchema), z.lazy(() => VendorCreateWithoutBankInputObjectSchema).array(), z.lazy(() => VendorUncheckedCreateWithoutBankInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutBankInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => VendorCreateOrConnectWithoutBankInputObjectSchema), z.lazy(() => VendorCreateOrConnectWithoutBankInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => VendorUpsertWithWhereUniqueWithoutBankInputObjectSchema), z.lazy(() => VendorUpsertWithWhereUniqueWithoutBankInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => VendorCreateManyBankInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => VendorWhereUniqueInputObjectSchema), z.lazy(() => VendorWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => VendorWhereUniqueInputObjectSchema), z.lazy(() => VendorWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => VendorWhereUniqueInputObjectSchema), z.lazy(() => VendorWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => VendorWhereUniqueInputObjectSchema), z.lazy(() => VendorWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => VendorUpdateWithWhereUniqueWithoutBankInputObjectSchema), z.lazy(() => VendorUpdateWithWhereUniqueWithoutBankInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => VendorUpdateManyWithWhereWithoutBankInputObjectSchema), z.lazy(() => VendorUpdateManyWithWhereWithoutBankInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => VendorScalarWhereInputObjectSchema), z.lazy(() => VendorScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const VendorUncheckedUpdateManyWithoutBankNestedInputObjectSchema: z.ZodType<Prisma.VendorUncheckedUpdateManyWithoutBankNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUncheckedUpdateManyWithoutBankNestedInput>;
export const VendorUncheckedUpdateManyWithoutBankNestedInputObjectZodSchema = makeSchema();
