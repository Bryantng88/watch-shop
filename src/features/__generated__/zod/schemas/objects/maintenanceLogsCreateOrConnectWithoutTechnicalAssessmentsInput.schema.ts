import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsWhereUniqueInputObjectSchema as maintenanceLogsWhereUniqueInputObjectSchema } from './maintenanceLogsWhereUniqueInput.schema';
import { maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsCreateWithoutTechnicalAssessmentsInput.schema';
import { maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => maintenanceLogsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInput>;
export const maintenanceLogsCreateOrConnectWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
