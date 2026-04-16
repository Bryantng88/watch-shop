import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenanceRecordCreateWithoutProductVariantInputObjectSchema as MaintenanceRecordCreateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordCreateWithoutProductVariantInput.schema';
import { MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema as MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema } from './MaintenanceRecordUncheckedCreateWithoutProductVariantInput.schema';
import { MaintenanceRecordCreateOrConnectWithoutProductVariantInputObjectSchema as MaintenanceRecordCreateOrConnectWithoutProductVariantInputObjectSchema } from './MaintenanceRecordCreateOrConnectWithoutProductVariantInput.schema';
import { MaintenanceRecordCreateManyProductVariantInputEnvelopeObjectSchema as MaintenanceRecordCreateManyProductVariantInputEnvelopeObjectSchema } from './MaintenanceRecordCreateManyProductVariantInputEnvelope.schema';
import { MaintenanceRecordWhereUniqueInputObjectSchema as MaintenanceRecordWhereUniqueInputObjectSchema } from './MaintenanceRecordWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenanceRecordCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenanceRecordCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenanceRecordCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenanceRecordCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema), z.lazy(() => MaintenanceRecordWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInput>;
export const MaintenanceRecordUncheckedCreateNestedManyWithoutProductVariantInputObjectZodSchema = makeSchema();
