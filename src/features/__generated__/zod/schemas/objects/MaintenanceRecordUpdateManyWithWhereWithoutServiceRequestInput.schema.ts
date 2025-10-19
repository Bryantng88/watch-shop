import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutServiceRequestInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutServiceRequestInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInput>;
export const MaintenanceRecordUpdateManyWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
