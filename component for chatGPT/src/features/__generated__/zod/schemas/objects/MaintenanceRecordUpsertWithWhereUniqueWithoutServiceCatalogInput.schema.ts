import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUpdateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUpdateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutServiceCatalogInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutServiceCatalogInputObjectZodSchema = makeSchema();
