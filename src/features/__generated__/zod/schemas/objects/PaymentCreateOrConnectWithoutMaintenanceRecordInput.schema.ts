import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentCreateWithoutMaintenanceRecordInputObjectSchema as PaymentCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentCreateWithoutMaintenanceRecordInput.schema';
import { PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUncheckedCreateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)])
}).strict();
export const PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateOrConnectWithoutMaintenanceRecordInput>;
export const PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
