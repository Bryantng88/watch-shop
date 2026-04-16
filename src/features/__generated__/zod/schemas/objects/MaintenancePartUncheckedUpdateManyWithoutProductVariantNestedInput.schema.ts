import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutProductVariantInputObjectSchema as MaintenancePartCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartCreateWithoutProductVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutProductVariantInput.schema';
import { MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema as MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutProductVariantInput.schema';
import { MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema as MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema } from './MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInput.schema';
import { MaintenancePartCreateManyProductVariantInputEnvelopeObjectSchema as MaintenancePartCreateManyProductVariantInputEnvelopeObjectSchema } from './MaintenancePartCreateManyProductVariantInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema as MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema } from './MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInput.schema';
import { MaintenancePartUpdateManyWithWhereWithoutProductVariantInputObjectSchema as MaintenancePartUpdateManyWithWhereWithoutProductVariantInputObjectSchema } from './MaintenancePartUpdateManyWithWhereWithoutProductVariantInput.schema';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutProductVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenancePartScalarWhereInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartUncheckedUpdateManyWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.MaintenancePartUncheckedUpdateManyWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUncheckedUpdateManyWithoutProductVariantNestedInput>;
export const MaintenancePartUncheckedUpdateManyWithoutProductVariantNestedInputObjectZodSchema = makeSchema();
