import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutVariantInputObjectSchema as MaintenanceRecordUpdateWithoutVariantInputObjectSchema } from './MaintenanceRecordUpdateWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutVariantInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
