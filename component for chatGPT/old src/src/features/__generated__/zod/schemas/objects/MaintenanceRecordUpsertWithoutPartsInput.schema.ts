import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordUpdateWithoutPartsInputObjectSchema as MaintenanceRecordUpdateWithoutPartsInputObjectSchema } from './MaintenanceRecordUpdateWithoutPartsInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutPartsInput.schema';
import { MaintenanceRecordCreateWithoutPartsInputObjectSchema as MaintenanceRecordCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateWithoutPartsInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPartsInput.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutPartsInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema)]),
  where: z.lazy(() => MaintenanceRecordWhereInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordUpsertWithoutPartsInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithoutPartsInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithoutPartsInput>;
export const MaintenanceRecordUpsertWithoutPartsInputObjectZodSchema = makeSchema();
