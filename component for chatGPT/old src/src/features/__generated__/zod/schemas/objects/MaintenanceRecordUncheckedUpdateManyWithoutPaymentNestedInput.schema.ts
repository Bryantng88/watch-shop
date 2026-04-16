import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutPaymentInputObjectSchema as MaintenanceRecordCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordCreateWithoutPaymentInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPaymentInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutPaymentInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInput.schema';
import { MaintenanceRecordCreateManyPaymentInputEnvelopeObjectSchema as MaintenanceRecordCreateManyPaymentInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyPaymentInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutPaymentInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutPaymentInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutPaymentInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutPaymentInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyPaymentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutPaymentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInput>;
export const MaintenanceRecordUncheckedUpdateManyWithoutPaymentNestedInputObjectZodSchema = makeSchema();
