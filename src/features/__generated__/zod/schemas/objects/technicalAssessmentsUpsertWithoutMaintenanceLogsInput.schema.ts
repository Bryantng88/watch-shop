import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUpdateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsCreateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema)]),
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)]),
  where: z.lazy(() => technicalAssessmentsWhereInputObjectSchema).optional()
}).strict();
export const technicalAssessmentsUpsertWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsUpsertWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsUpsertWithoutMaintenanceLogsInput>;
export const technicalAssessmentsUpsertWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
