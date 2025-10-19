import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutProductInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutProductInput>;
export const MaintenanceRecordUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
