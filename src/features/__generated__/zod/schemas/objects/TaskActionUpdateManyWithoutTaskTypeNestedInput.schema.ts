import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutTaskTypeInputObjectSchema as TaskActionCreateWithoutTaskTypeInputObjectSchema } from './TaskActionCreateWithoutTaskTypeInput.schema';
import { TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskActionUncheckedCreateWithoutTaskTypeInput.schema';
import { TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema as TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema } from './TaskActionCreateOrConnectWithoutTaskTypeInput.schema';
import { TaskActionUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema as TaskActionUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema } from './TaskActionUpsertWithWhereUniqueWithoutTaskTypeInput.schema';
import { TaskActionCreateManyTaskTypeInputEnvelopeObjectSchema as TaskActionCreateManyTaskTypeInputEnvelopeObjectSchema } from './TaskActionCreateManyTaskTypeInputEnvelope.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema as TaskActionUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema } from './TaskActionUpdateWithWhereUniqueWithoutTaskTypeInput.schema';
import { TaskActionUpdateManyWithWhereWithoutTaskTypeInputObjectSchema as TaskActionUpdateManyWithWhereWithoutTaskTypeInputObjectSchema } from './TaskActionUpdateManyWithWhereWithoutTaskTypeInput.schema';
import { TaskActionScalarWhereInputObjectSchema as TaskActionScalarWhereInputObjectSchema } from './TaskActionScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionCreateWithoutTaskTypeInputObjectSchema).array(), z.lazy(() => TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTaskTypeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionCreateOrConnectWithoutTaskTypeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskActionCreateManyTaskTypeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskActionWhereUniqueInputObjectSchema), z.lazy(() => TaskActionWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskActionUpdateManyWithWhereWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskActionUpdateManyWithWhereWithoutTaskTypeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskActionScalarWhereInputObjectSchema), z.lazy(() => TaskActionScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskActionUpdateManyWithoutTaskTypeNestedInputObjectSchema: z.ZodType<Prisma.TaskActionUpdateManyWithoutTaskTypeNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionUpdateManyWithoutTaskTypeNestedInput>;
export const TaskActionUpdateManyWithoutTaskTypeNestedInputObjectZodSchema = makeSchema();
