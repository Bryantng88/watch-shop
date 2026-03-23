import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutUserInputObjectSchema as MaintenanceRecordUpdateWithoutUserInputObjectSchema } from './MaintenanceRecordUpdateWithoutUserInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutUserInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutUserInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutUserInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
