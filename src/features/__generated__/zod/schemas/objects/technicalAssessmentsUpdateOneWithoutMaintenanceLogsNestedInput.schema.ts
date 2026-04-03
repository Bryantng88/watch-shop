import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsCreateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUpsertWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUpsertWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUpsertWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './technicalAssessmentsWhereUniqueInput.schema';
import { technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUpdateWithoutMaintenanceLogsInput.schema';
import { technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema as technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema } from './technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => technicalAssessmentsCreateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => technicalAssessmentsCreateOrConnectWithoutMaintenanceLogsInputObjectSchema).optional(),
  upsert: z.lazy(() => technicalAssessmentsUpsertWithoutMaintenanceLogsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => technicalAssessmentsWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => technicalAssessmentsWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => technicalAssessmentsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => technicalAssessmentsUpdateToOneWithWhereWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUpdateWithoutMaintenanceLogsInputObjectSchema), z.lazy(() => technicalAssessmentsUncheckedUpdateWithoutMaintenanceLogsInputObjectSchema)]).optional()
}).strict();
export const technicalAssessmentsUpdateOneWithoutMaintenanceLogsNestedInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsUpdateOneWithoutMaintenanceLogsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsUpdateOneWithoutMaintenanceLogsNestedInput>;
export const technicalAssessmentsUpdateOneWithoutMaintenanceLogsNestedInputObjectZodSchema = makeSchema();
