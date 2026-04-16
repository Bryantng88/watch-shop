import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUpdateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordCreateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutMaintenancePartInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema)]),
  where: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordUpsertWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithoutMaintenancePartInput>;
export const MaintenanceRecordUpsertWithoutMaintenancePartInputObjectZodSchema = makeSchema();
