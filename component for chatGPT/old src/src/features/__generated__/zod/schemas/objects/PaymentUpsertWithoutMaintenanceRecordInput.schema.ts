import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentUpdateWithoutMaintenanceRecordInputObjectSchema as PaymentUpdateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUpdateWithoutMaintenanceRecordInput.schema';
import { PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUncheckedUpdateWithoutMaintenanceRecordInput.schema';
import { PaymentCreateWithoutMaintenanceRecordInputObjectSchema as PaymentCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentCreateWithoutMaintenanceRecordInput.schema';
import { PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PaymentUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]),
  where: z.lazy(() => PaymentWhereInputObjectSchema).optional()
}).strict();
export const PaymentUpsertWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.PaymentUpsertWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpsertWithoutMaintenanceRecordInput>;
export const PaymentUpsertWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
