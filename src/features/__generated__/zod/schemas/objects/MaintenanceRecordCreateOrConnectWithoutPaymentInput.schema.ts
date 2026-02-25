import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordCreateWithoutPaymentInputObjectSchema as MaintenanceRecordCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordCreateWithoutPaymentInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema)])
}).strict();
export const MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateOrConnectWithoutPaymentInput>;
export const MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectZodSchema = makeSchema();
