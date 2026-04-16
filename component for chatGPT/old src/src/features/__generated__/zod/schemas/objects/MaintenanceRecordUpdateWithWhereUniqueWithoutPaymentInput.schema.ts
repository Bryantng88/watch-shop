import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema';
import { MaintenanceRecordUpdateWithoutPaymentInputObjectSchema as MaintenanceRecordUpdateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUpdateWithoutPaymentInput.schema';
import { MaintenanceRecordUncheckedUpdateWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedUpdateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedUpdateWithoutPaymentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => MaintenanceRecordUpdateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedUpdateWithoutPaymentInputObjectSchema)])
}).strict();
export const MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInput>;
export const MaintenanceRecordUpdateWithWhereUniqueWithoutPaymentInputObjectZodSchema = makeSchema();
