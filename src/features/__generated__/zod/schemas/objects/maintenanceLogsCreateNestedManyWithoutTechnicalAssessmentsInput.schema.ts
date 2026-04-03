import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsCreateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema as maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema } from './maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelope.schema';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema).array(), z.lazy(() => maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => maintenanceLogsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema), z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const maintenanceLogsCreateNestedManyWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsCreateNestedManyWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsCreateNestedManyWithoutTechnicalAssessmentsInput>;
export const maintenanceLogsCreateNestedManyWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
