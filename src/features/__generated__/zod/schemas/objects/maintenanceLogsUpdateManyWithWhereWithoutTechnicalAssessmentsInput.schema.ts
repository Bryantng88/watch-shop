import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { maintenanceLogsScalarWhereInputObjectSchema as maintenanceLogsScalarWhereInputObjectSchema } from './maintenanceLogsScalarWhereInput.schema';
import { maintenanceLogsUpdateManyMutationInputObjectSchema as maintenanceLogsUpdateManyMutationInputObjectSchema } from './maintenanceLogsUpdateManyMutationInput.schema';
import { maintenanceLogsUncheckedUpdateManyWithoutTechnicalAssessmentsInputObjectSchema as maintenanceLogsUncheckedUpdateManyWithoutTechnicalAssessmentsInputObjectSchema } from './maintenanceLogsUncheckedUpdateManyWithoutTechnicalAssessmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => maintenanceLogsScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => maintenanceLogsUpdateManyMutationInputObjectSchema), z.lazy(() => maintenanceLogsUncheckedUpdateManyWithoutTechnicalAssessmentsInputObjectSchema)])
}).strict();
export const maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInput>;
export const maintenanceLogsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
