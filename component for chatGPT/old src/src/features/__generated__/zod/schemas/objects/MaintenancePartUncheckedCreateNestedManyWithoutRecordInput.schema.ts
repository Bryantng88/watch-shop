import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutRecordInputObjectSchema as MaintenancePartCreateWithoutRecordInputObjectSchema } from './MaintenancePartCreateWithoutRecordInput.schema';
import { MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema as MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutRecordInput.schema';
import { MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema as MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutRecordInput.schema';
import { MaintenancePartCreateManyRecordInputEnvelopeObjectSchema as MaintenancePartCreateManyRecordInputEnvelopeObjectSchema } from './MaintenancePartCreateManyRecordInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutRecordInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutRecordInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutRecordInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyRecordInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartUncheckedCreateNestedManyWithoutRecordInputObjectSchema: z.ZodType<Prisma.MaintenancePartUncheckedCreateNestedManyWithoutRecordInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUncheckedCreateNestedManyWithoutRecordInput>;
export const MaintenancePartUncheckedCreateNestedManyWithoutRecordInputObjectZodSchema = makeSchema();
