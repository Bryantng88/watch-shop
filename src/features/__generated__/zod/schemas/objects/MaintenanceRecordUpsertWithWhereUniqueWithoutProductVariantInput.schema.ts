import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutProductVariantInputObjectSchema as MaintenanceRecordUpdateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUpdateWithoutProductVariantInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutProductVariantInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutProductVariantInput.schema';
import { MaintenanceRecordCreateWithoutProductVariantInputObjectSchema as MaintenanceRecordCreateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordCreateWithoutProductVariantInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutProductVariantInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
