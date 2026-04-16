import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutMaintenanceRecordInputObjectSchema as PaymentCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentCreateWithoutMaintenanceRecordInput.schema';
import { PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema as PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUncheckedCreateWithoutMaintenanceRecordInput.schema';
import { PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectSchema as PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectSchema } from './PaymentCreateOrConnectWithoutMaintenanceRecordInput.schema';
import { PaymentUpsertWithoutMaintenanceRecordInputObjectSchema as PaymentUpsertWithoutMaintenanceRecordInputObjectSchema } from './PaymentUpsertWithoutMaintenanceRecordInput.schema';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema as PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema } from './PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInput.schema';
import { PaymentUpdateWithoutMaintenanceRecordInputObjectSchema as PaymentUpdateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUpdateWithoutMaintenanceRecordInput.schema';
import { PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema as PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema } from './PaymentUncheckedUpdateWithoutMaintenanceRecordInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutMaintenanceRecordInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutMaintenanceRecordInputObjectSchema).optional(),
  upsert: z.lazy(() => PaymentUpsertWithoutMaintenanceRecordInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => PaymentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => PaymentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PaymentUpdateToOneWithWhereWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUpdateWithoutMaintenanceRecordInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutMaintenanceRecordInputObjectSchema)]).optional()
}).strict();
export const PaymentUpdateOneWithoutMaintenanceRecordNestedInputObjectSchema: z.ZodType<Prisma.PaymentUpdateOneWithoutMaintenanceRecordNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateOneWithoutMaintenanceRecordNestedInput>;
export const PaymentUpdateOneWithoutMaintenanceRecordNestedInputObjectZodSchema = makeSchema();
