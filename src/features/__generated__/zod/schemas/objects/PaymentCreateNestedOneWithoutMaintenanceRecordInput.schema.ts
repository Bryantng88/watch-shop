import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutMaintenanceRecordInputObjectSchema as PaymentCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentCreateWithoutMaintenanceRecordInput.schema';
import { PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './PaymentCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputObjectSchema).optional()
}).strict();
export const PaymentCreateNestedOneWithoutMaintenanceRecordInputObjectSchema: z.ZodType<Prisma.PaymentCreateNestedOneWithoutMaintenanceRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateNestedOneWithoutMaintenanceRecordInput>;
export const PaymentCreateNestedOneWithoutMaintenanceRecordInputObjectZodSchema = makeSchema();
