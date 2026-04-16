import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutUserInputObjectSchema as MaintenanceRecordUpdateWithoutUserInputObjectSchema } from './MaintenanceRecordUpdateWithoutUserInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutUserInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutUserInput.schema';
import { MaintenanceRecordCreateWithoutUserInputObjectSchema as MaintenanceRecordCreateWithoutUserInputObjectSchema } from './MaintenanceRecordCreateWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutUserInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutUserInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutUserInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutUserInputObjectZodSchema = makeSchema();
