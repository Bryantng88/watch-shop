import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsUpdateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUpdateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => maintenanceLogsUpdateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedUpdateWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInput>;
export const maintenanceLogsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
