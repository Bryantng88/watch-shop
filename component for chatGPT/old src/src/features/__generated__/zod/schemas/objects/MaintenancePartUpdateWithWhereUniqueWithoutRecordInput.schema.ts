import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithoutRecordInputObjectSchema as MaintenancePartUpdateWithoutRecordInputObjectSchema } from './MaintenancePartUpdateWithoutRecordInput.schema';
import { MaintenancePartUncheckedUpdateWithoutRecordInputObjectSchema as MaintenancePartUncheckedUpdateWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedUpdateWithoutRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenancePartUpdateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedUpdateWithoutRecordInputObjectSchema)])
}).strict();
export const MaintenancePartUpdateWithWhereUniqueWithoutRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateWithWhereUniqueWithoutRecordInput>;
export const MaintenancePartUpdateWithWhereUniqueWithoutRecordInputObjectZodSchema = makeSchema();
