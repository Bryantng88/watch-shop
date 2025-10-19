import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceDetailInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceDetailInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutServiceDetailInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutServiceDetailInput>;
export const MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectZodSchema = makeSchema();
