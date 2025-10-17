import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutVariantInputObjectSchema as MaintenanceRecordCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordCreateWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVariantInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutVariantInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInput.schema';
import { MaintenanceRecordCreateManyVariantInputEnvelopeObjectSchema as MaintenanceRecordCreateManyVariantInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyVariantInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutVariantInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutVariantInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutVariantInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUpdateManyWithoutVariantNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithoutVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithoutVariantNestedInput>;
export const MaintenanceRecordUpdateManyWithoutVariantNestedInputObjectZodSchema = makeSchema();
