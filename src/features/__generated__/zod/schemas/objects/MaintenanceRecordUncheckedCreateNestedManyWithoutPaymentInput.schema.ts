import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutPaymentInputObjectSchema as MaintenanceRecordCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordCreateWithoutPaymentInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutPaymentInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutPaymentInput.schema';
import { MaintenanceRecordCreateManyPaymentInputEnvelopeObjectSchema as MaintenanceRecordCreateManyPaymentInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyPaymentInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutPaymentInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutPaymentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutPaymentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyPaymentInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInput>;
export const MaintenanceRecordUncheckedCreateNestedManyWithoutPaymentInputObjectZodSchema = makeSchema();
