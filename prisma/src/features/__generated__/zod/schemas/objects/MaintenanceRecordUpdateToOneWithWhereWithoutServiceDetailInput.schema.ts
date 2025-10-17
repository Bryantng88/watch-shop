import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema';
import { MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUpdateWithoutServiceDetailInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutServiceDetailInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInput>;
export const MaintenanceRecordUpdateToOneWithWhereWithoutServiceDetailInputObjectZodSchema = makeSchema();
