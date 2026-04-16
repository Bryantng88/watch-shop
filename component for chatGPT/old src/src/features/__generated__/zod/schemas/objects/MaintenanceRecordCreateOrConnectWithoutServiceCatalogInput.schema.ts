import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceCatalogInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutServiceCatalogInput>;
export const MaintenanceRecordCreateOrConnectWithoutServiceCatalogInputObjectZodSchema = makeSchema();
