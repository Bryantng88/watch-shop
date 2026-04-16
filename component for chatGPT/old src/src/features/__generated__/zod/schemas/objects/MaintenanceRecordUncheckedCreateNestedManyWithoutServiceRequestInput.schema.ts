import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateWithoutServiceRequestInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutServiceRequestInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutServiceRequestInput.schema';
import { MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectSchema as MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyServiceRequestInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedCreateNestedManyWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutServiceRequestInput>;
export const MaintenanceRecordUncheckedCreateNestedManyWithoutServiceRequestInputObjectZodSchema = makeSchema();
