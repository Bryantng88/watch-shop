import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema as TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManyTechnicalDetailCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutTechnicalDetailCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyTechnicalDetailCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateManyWithWhereWithoutTechnicalDetailCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskActionScalarWhereInputObjectSchema), z.lazy(() => TaskActionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithoutTechnicalDetailCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithoutTechnicalDetailCatalogNestedInput>;
export const TaskActionUpdateManyWithoutTechnicalDetailCatalogNestedInputObjectZodSchema = makeSchema();
