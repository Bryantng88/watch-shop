import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTaskTypeInputObjectSchema as TaskCreateWithoutTaskTypeInputObjectSchema } from './TaskCreateWithoutTaskTypeInput.schema';
import { TaskUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskUncheckedCreateWithoutTaskTypeInput.schema';
import { TaskCreateOrConnectWithoutTaskTypeInputObjectSchema as TaskCreateOrConnectWithoutTaskTypeInputObjectSchema } from './TaskCreateOrConnectWithoutTaskTypeInput.schema';
import { TaskUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema as TaskUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutTaskTypeInput.schema';
import { TaskCreateManyTaskTypeInputEnvelopeObjectSchema as TaskCreateManyTaskTypeInputEnvelopeObjectSchema } from './TaskCreateManyTaskTypeInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema as TaskUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutTaskTypeInput.schema';
import { TaskUpdateManyWithWhereWithoutTaskTypeInputObjectSchema as TaskUpdateManyWithWhereWithoutTaskTypeInputObjectSchema } from './TaskUpdateManyWithWhereWithoutTaskTypeInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskCreateWithoutTaskTypeInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskTypeInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutTaskTypeInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutTaskTypeInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyTaskTypeInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutTaskTypeInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutTaskTypeInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedUpdateManyWithoutTaskTypeNestedInputObjectSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutTaskTypeNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutTaskTypeNestedInput>;
export const TaskUncheckedUpdateManyWithoutTaskTypeNestedInputObjectZodSchema = makeSchema();
