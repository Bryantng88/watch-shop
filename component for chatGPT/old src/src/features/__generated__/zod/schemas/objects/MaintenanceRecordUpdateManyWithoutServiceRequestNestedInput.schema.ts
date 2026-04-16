import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceRequestInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceRequestInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutServiceRequestInput.schema';
import { MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema as MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInput.schema';
import { MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectSchema as MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyServiceRequestInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema as MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInput.schema';
import { MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInputObjectSchema as MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInput.schema';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUpdateManyWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithoutServiceRequestNestedInput>;
export const MaintenanceRecordUpdateManyWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
