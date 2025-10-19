import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutProductInputObjectSchema as MaintenanceRecordCreateWithoutProductInputObjectSchema } from './MaintenanceRecordCreateWithoutProductInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutProductInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutProductInput.schema';
import { MaintenanceRecordCreateManyProductInputEnvelopeObjectSchema as MaintenanceRecordCreateManyProductInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyProductInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutProductInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateNestedManyWithoutProductInput>;
export const MaintenanceRecordCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();
