import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutProductInputObjectSchema as MaintenanceRecordUpdateWithoutProductInputObjectSchema } from './MaintenanceRecordUpdateWithoutProductInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutProductInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutProductInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
