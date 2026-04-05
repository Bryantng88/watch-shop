import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUpdateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUpdateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
