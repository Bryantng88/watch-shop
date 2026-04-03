import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsCreateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema as maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema } from './maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelope.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsScalarWhereInputObjectSchema as maintenanceLogsScalarWhereInputObjectSchema } from './maintenanceLogsScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema).array(), z.lazy(() => maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => maintenanceLogsScalarWhereInputObjectSchema), z.lazy(() => maintenanceLogsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const maintenanceLogsUpdateManyWithoutTechnicalAssessmentsNestedInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpdateManyWithoutTechnicalAssessmentsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateManyWithoutTechnicalAssessmentsNestedInput>;
export const maintenanceLogsUpdateManyWithoutTechnicalAssessmentsNestedInputObjectZodSchema = makeSchema();
