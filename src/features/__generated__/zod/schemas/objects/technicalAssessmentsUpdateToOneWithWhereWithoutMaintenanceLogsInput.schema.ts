import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema';
import { technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUpdateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => technicalAssessmentsWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema)])
}).strict();
export const technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInput>;
export const technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
