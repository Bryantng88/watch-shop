import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceDetailInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceDetailInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutServiceDetailInput.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceDetailInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceDetailInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceDetailInputObjectSchema).optional(),
  connect: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).optional()
}).strict();
export const MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateNestedOneWithoutServiceDetailInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateNestedOneWithoutServiceDetailInput>;
export const MaintenanceRecordCreateNestedOneWithoutServiceDetailInputObjectZodSchema = makeSchema();
