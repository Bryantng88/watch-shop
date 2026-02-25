import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema';
import { PaymentUpdateWithoutMaintenanceRecordInputObjectSchema as PaymentUpdateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUpdateWithoutMaintenanceRecordInput.schema';
import { PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PaymentUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInput>;
export const PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
