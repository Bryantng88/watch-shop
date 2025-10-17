import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MaintenancePartCreateWithoutVariantInputObjectSchema as MaintenancePartCreateWithoutVariantInputObjectSchema } from './MaintenancePartCreateWithoutVariantInput.schema';
import { MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema as MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema } from './MaintenancePartUncheckedCreateWithoutVariantInput.schema';
import { MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema as MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema } from './MaintenancePartCreateOrConnectWithoutVariantInput.schema';
import { MaintenancePartUpsertWithWhereUniqueWithoutVariantInputObjectSchema as MaintenancePartUpsertWithWhereUniqueWithoutVariantInputObjectSchema } from './MaintenancePartUpsertWithWhereUniqueWithoutVariantInput.schema';
import { MaintenancePartCreateManyVariantInputEnvelopeObjectSchema as MaintenancePartCreateManyVariantInputEnvelopeObjectSchema } from './MaintenancePartCreateManyVariantInputEnvelope.schema';
import { MaintenancePartWhereUniqueInputObjectSchema as MaintenancePartWhereUniqueInputObjectSchema } from './MaintenancePartWhereUniqueInput.schema';
import { MaintenancePartUpdateWithWhereUniqueWithoutVariantInputObjectSchema as MaintenancePartUpdateWithWhereUniqueWithoutVariantInputObjectSchema } from './MaintenancePartUpdateWithWhereUniqueWithoutVariantInput.schema';
import { MaintenancePartUpdateManyWithWhereWithoutVariantInputObjectSchema as MaintenancePartUpdateManyWithWhereWithoutVariantInputObjectSchema } from './MaintenancePartUpdateManyWithWhereWithoutVariantInput.schema';
import { MaintenancePartScalarWhereInputObjectSchema as MaintenancePartScalarWhereInputObjectSchema } from './MaintenancePartScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => MaintenancePartCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUpsertWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => MaintenancePartCreateManyVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema), z.lazy(() => MaintenancePartWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUpdateWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutVariantInputObjectSchema), z.lazy(() => MaintenancePartUpdateManyWithWhereWithoutVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => MaintenancePartScalarWhereInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const MaintenancePartUpdateManyWithoutVariantNestedInputObjectSchema: z.ZodType<Prisma.MaintenancePartUpdateManyWithoutVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartUpdateManyWithoutVariantNestedInput>;
export const MaintenancePartUpdateManyWithoutVariantNestedInputObjectZodSchema = makeSchema();
