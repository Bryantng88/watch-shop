import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsCreateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './technicalAssessmentsWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema).optional(),
  connect: z.lazy(() => technicalAssessmentsWhereUniqueInputObjectSchema).optional()
}).strict();
export const technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInput>;
export const technicalAssessmentsCreateNestedOneWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
