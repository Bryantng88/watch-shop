import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutUserInputObjectSchema as MaintenanceRecordCreateWithoutUserInputObjectSchema } from './MaintenanceRecordCreateWithoutUserInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutUserInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutUserInput.schema';
import { MaintenanceRecordCreateManyUserInputEnvelopeObjectSchema as MaintenanceRecordCreateManyUserInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyUserInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutUserInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutUserInput>;
export const MaintenanceRecordUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
