import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInput>;
export const MaintenanceRecordUpdateManyWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
