import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordCreateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutMaintenancePartInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutMaintenancePartInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutMaintenancePartInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutMaintenancePartInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MaintenanceRecordCreateOrConnectWithoutMaintenancePartInputObjectSchema).optional(),
  connect: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordCreateNestedOneWithoutMaintenancePartInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateNestedOneWithoutMaintenancePartInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateNestedOneWithoutMaintenancePartInput>;
export const MaintenanceRecordCreateNestedOneWithoutMaintenancePartInputObjectZodSchema = makeSchema();
