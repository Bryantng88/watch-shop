import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutVariantInputObjectSchema as MaintenanceRecordCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordCreateWithoutVariantInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutVariantInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutVariantInput.schema';
import { MaintenanceRecordCreateManyVariantInputEnvelopeObjectSchema as MaintenanceRecordCreateManyVariantInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyVariantInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordCreateNestedManyWithoutVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordCreateNestedManyWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordCreateNestedManyWithoutVariantInput>;
export const MaintenanceRecordCreateNestedManyWithoutVariantInputObjectZodSchema = makeSchema();
