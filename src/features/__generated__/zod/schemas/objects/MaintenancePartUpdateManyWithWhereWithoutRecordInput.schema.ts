import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema';
import { MaintenancePartUpdateManyMutationInputObjectSchema as MaintenancePartUpdateManyMutationInputObjectSchema } from './MaintenancePartUpdateManyMutationInput.schema';
import { MaintenancePartUncheckedUpdateManyWithoutRecordInputObjectSchema as MaintenancePartUncheckedUpdateManyWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedUpdateManyWithoutRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateManyMutationInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateManyWithoutRecordInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateManyWithWhereWithoutRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyWithWhereWithoutRecordInput>;
export const MaintenancePartUpdateManyWithWhereWithoutRecordInputObjectZodSchema = makeSchema();
