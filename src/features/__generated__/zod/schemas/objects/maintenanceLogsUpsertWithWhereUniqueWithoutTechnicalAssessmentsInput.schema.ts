import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsUpdateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUpdateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsCreateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => maintenanceLogsUpdateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInput>;
export const maintenanceLogsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
