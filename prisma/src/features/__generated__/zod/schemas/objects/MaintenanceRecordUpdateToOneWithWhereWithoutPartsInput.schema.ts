import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema';
import { MaintenanceRecordUpdateWithoutPartsInputObjectSchema as MaintenanceRecordUpdateWithoutPartsInputObjectSchema } from './MaintenanceRecordUpdateWithoutPartsInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutPartsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateToOneWithWhereWithoutPartsInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateToOneWithWhereWithoutPartsInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateToOneWithWhereWithoutPartsInput>;
export const MaintenanceRecordUpdateToOneWithWhereWithoutPartsInputObjectZodSchema = makeSchema();
