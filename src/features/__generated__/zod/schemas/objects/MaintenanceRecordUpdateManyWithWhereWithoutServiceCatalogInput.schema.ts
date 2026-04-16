import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutServiceCatalogInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInput>;
export const MaintenanceRecordUpdateManyWithWhereWithoutServiceCatalogInputObjectZodSchema = makeSchema();
