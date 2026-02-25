import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutPaymentInputObjectSchema as MaintenanceRecordUpdateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUpdateWithoutPaymentInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutPaymentInput.schema';
import { MaintenanceRecordCreateWithoutPaymentInputObjectSchema as MaintenanceRecordCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordCreateWithoutPaymentInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutPaymentInputObjectSchema)]),
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInput>;
export const MaintenanceRecordUpsertWithWhereUniqueWithoutPaymentInputObjectZodSchema = makeSchema();
