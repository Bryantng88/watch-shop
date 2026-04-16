import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutPartsInputObjectSchema as MaintenanceRecordCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateWithoutPartsInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPartsInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutPartsInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutPartsInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MaintenanceRecordCreateOrConnectWithoutPartsInputObjectSchema).optional(),
  connect: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordCreateNestedOneWithoutPartsInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateNestedOneWithoutPartsInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateNestedOneWithoutPartsInput>;
export const MaintenanceRecordCreateNestedOneWithoutPartsInputObjectZodSchema = makeSchema();
