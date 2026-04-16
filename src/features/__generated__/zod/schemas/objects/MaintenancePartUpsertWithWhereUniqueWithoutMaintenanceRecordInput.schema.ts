import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUpdateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUpdateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInput>;
export const MaintenancePartUpsertWithWhereUniqueWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
