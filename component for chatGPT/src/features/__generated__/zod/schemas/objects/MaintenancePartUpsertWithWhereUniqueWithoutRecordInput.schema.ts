import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutRecordInputObjectSchema as MaintenancePartUpdateWithoutRecordInputObjectSchema } from './MaintenancePartUpdateWithoutRecordInput.schema';
import { MaintenancePartUncheckedUpdateWithoutRecordInputObjectSchema as MaintenancePartUncheckedUpdateWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutRecordInput.schema';
import { MaintenancePartCreateWithoutRecordInputObjectSchema as MaintenancePartCreateWithoutRecordInputObjectSchema } from './MaintenancePartCreateWithoutRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema)])
}).strict();
export const MaintenancePartUpsertWithWhereUniqueWithoutRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpsertWithWhereUniqueWithoutRecordInput>;
export const MaintenancePartUpsertWithWhereUniqueWithoutRecordInputObjectZodSchema = makeSchema();
