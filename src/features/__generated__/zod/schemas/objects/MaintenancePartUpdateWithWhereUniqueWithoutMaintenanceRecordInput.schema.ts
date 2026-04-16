import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUpdateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUpdateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInput>;
export const MaintenancePartUpdateWithWhereUniqueWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
