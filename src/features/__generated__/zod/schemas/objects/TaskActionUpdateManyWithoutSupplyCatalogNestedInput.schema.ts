import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutSupplyCatalogInputObjectSchema as TaskActionCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionCreateWithoutSupplyCatalogInput.schema';
import { TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema as TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema } from './TaskActionUncheckedCreateWithoutSupplyCatalogInput.schema';
import { TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema as TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema } from './TaskActionCreateOrConnectWithoutSupplyCatalogInput.schema';
import { TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema as TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema } from './TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInput.schema';
import { TaskActionCreateManySupplyCatalogInputEnvelopeObjectSchema as TaskActionCreateManySupplyCatalogInputEnvelopeObjectSchema } from './TaskActionCreateManySupplyCatalogInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema as TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema } from './TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInput.schema';
import { TaskActionUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema as TaskActionUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema } from './TaskActionUpdateManyWithWhereWithoutSupplyCatalogInput.schema';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionCreateWithoutSupplyCatalogInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManySupplyCatalogInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskActionUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema), z.lazy(() => TaskActionUpdateManyWithWhereWithoutSupplyCatalogInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskActionScalarWhereInputObjectSchema), z.lazy(() => TaskActionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionUpdateManyWithoutSupplyCatalogNestedInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithoutSupplyCatalogNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithoutSupplyCatalogNestedInput>;
export const TaskActionUpdateManyWithoutSupplyCatalogNestedInputObjectZodSchema = makeSchema();
