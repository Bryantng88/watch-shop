import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutVariantInputObjectSchema as MaintenanceRecordUpdateWithoutVariantInputObjectSchema } from './MaintenanceRecordUpdateWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutVariantInput.schema';
import { MaintenanceRecordCreateWithoutVariantInputObjectSchema as MaintenanceRecordCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordCreateWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
