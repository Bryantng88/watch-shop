import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema';
import { MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUpdateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInput>;
export const MaintenanceRecordUpdateToOneWithWhereWithoutMaintenancePartInputObjectZodSchema = makeSchema();
