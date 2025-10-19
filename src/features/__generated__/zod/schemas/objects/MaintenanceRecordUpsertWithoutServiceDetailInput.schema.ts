import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUpdateWithoutServiceDetailInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutServiceDetailInput.schema';
import { MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceDetailInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceDetailInput.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutServiceDetailInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema)]),
  where: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordUpsertWithoutServiceDetailInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithoutServiceDetailInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithoutServiceDetailInput>;
export const MaintenanceRecordUpsertWithoutServiceDetailInputObjectZodSchema = makeSchema();
