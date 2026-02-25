import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutPaymentInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateManyWithWhereWithoutPaymentInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutPaymentInput>;
export const MaintenanceRecordUpdateManyWithWhereWithoutPaymentInputObjectZodSchema = makeSchema();
