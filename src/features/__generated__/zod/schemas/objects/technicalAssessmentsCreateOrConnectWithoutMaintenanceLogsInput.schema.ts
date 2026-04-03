import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './technicalAssessmentsWhereUniqueInput.schema';
import { technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsCreateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => technicalAssessmentsWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)])
}).strict();
export const technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInput>;
export const technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
