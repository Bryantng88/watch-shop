import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutProductVariantInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutProductVariantInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateManyWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutProductVariantInput>;
export const MaintenanceRecordUpdateManyWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
