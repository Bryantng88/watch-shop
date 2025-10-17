import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutProductInputObjectSchema as MaintenanceRecordUpdateWithoutProductInputObjectSchema } from './MaintenanceRecordUpdateWithoutProductInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutProductInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutProductInput.schema';
import { MaintenanceRecordCreateWithoutProductInputObjectSchema as MaintenanceRecordCreateWithoutProductInputObjectSchema } from './MaintenanceRecordCreateWithoutProductInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutProductInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
