import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateOrConnectWithoutMaintenanceRecordInput>;
export const MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
