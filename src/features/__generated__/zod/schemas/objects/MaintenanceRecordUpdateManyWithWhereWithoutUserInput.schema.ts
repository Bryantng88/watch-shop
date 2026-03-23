import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordScalarWhereInputObjectSchema as MaintenanceRecordScalarWhereInputObjectSchema } from './MaintenanceRecordScalarWhereInput.schema';
import { MaintenanceRecordUpdateManyMutationInputObjectSchema as MaintenanceRecordUpdateManyMutationInputObjectSchema } from './MaintenanceRecordUpdateManyMutationInput.schema';
import { MaintenanceRecordUncheckedUpdateManyWithoutUserInputObjectSchema as MaintenanceRecordUncheckedUpdateManyWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedUpdateManyWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateManyWithoutUserInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateManyWithWhereWithoutUserInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateManyWithWhereWithoutUserInput>;
export const MaintenanceRecordUpdateManyWithWhereWithoutUserInputObjectZodSchema = makeSchema();
