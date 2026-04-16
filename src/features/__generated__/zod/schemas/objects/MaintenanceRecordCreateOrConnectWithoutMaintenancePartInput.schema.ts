import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordCreateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutMaintenancePartInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutMaintenancePartInput>;
export const MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectZodSchema = makeSchema();
