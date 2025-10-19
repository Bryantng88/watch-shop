import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutProductInputObjectSchema as MaintenanceRecordCreateWithoutProductInputObjectSchema } from './MaintenanceRecordCreateWithoutProductInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutProductInput>;
export const MaintenanceRecordCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
