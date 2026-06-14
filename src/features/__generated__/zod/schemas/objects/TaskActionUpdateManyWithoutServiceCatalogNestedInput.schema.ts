import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutServiceCatalogInputObjectSchema as TaskActionCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionCreateWithoutServiceCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutServiceCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutServiceCatalogInput.schema';
import { TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema as TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInput.schema';
import { TaskActionCreateManyServiceCatalogInputEnvelopeObjectSchema as TaskActionCreateManyServiceCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManyServiceCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema as TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema } from './TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInput.schema';
import { TaskActionUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema as TaskActionUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema } from './TaskActionUpdateManyWithWhereWithoutServiceCatalogInput.schema';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutServiceCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyServiceCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskActionUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateManyWithWhereWithoutServiceCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskActionScalarWhereInputObjectSchema), z.lazy(() => TaskActionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionUpdateManyWithoutServiceCatalogNestedInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithoutServiceCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithoutServiceCatalogNestedInput>;
export const TaskActionUpdateManyWithoutServiceCatalogNestedInputObjectZodSchema = makeSchema();
