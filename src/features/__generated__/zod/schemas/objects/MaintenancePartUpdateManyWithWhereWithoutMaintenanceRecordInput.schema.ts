import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema';
import { MaintenancePartUpdateManyMutationInputObjectSchema as MaintenancePartUpdateManyMutationInputObjectSchema } from './MaintenancePartUpdateManyMutationInput.schema';
import { MaintenancePartUncheckedUpdateManyWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUncheckedUpdateManyWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUncheckedUpdateManyWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateManyWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInput>;
export const MaintenancePartUpdateManyWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
