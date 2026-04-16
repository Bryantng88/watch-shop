import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutProductVariantInputObjectSchema as MaintenanceRecordUpdateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUpdateWithoutProductVariantInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutProductVariantInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutProductVariantInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
