import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionCreateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutMechanicalPartCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInput.schema';
import { TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema as TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManyMechanicalPartCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInput.schema';
import { TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema as TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema } from './TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInput.schema';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutMechanicalPartCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyMechanicalPartCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateManyWithWhereWithoutMechanicalPartCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskActionScalarWhereInputObjectSchema), z.lazy(() => TaskActionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInputObjectSchema: z.ZodType<Prisma.TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInput>;
export const TaskActionUncheckedUpdateManyWithoutMechanicalPartCatalogNestedInputObjectZodSchema = makeSchema();
