import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutPartsInputObjectSchema as MaintenanceRecordCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordCreateWithoutPartsInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPartsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPartsInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPartsInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutPartsInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutPartsInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutPartsInput>;
export const MaintenanceRecordCreateOrConnectWithoutPartsInputObjectZodSchema = makeSchema();
