import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectSchema as MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectSchema } from './MaintenancePartCreateManyMaintenanceRecordInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutMaintenanceRecordInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyMaintenanceRecordInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartCreateNestedManyWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartCreateNestedManyWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCreateNestedManyWithoutMaintenanceRecordInput>;
export const MaintenancePartCreateNestedManyWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
