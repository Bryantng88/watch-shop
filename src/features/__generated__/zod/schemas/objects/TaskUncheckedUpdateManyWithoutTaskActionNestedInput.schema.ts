import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTaskActionInputObjectSchema as TaskCreateWithoutTaskActionInputObjectSchema } from './TaskCreateWithoutTaskActionInput.schema';
import { TaskUncheckedCreateWithoutTaskActionInputObjectSchema as TaskUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskUncheckedCreateWithoutTaskActionInput.schema';
import { TaskCreateOrConnectWithoutTaskActionInputObjectSchema as TaskCreateOrConnectWithoutTaskActionInputObjectSchema } from './TaskCreateOrConnectWithoutTaskActionInput.schema';
import { TaskUpsertWithWhereUniqueWithoutTaskActionInputObjectSchema as TaskUpsertWithWhereUniqueWithoutTaskActionInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutTaskActionInput.schema';
import { TaskCreateManyTaskActionInputEnvelopeObjectSchema as TaskCreateManyTaskActionInputEnvelopeObjectSchema } from './TaskCreateManyTaskActionInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutTaskActionInputObjectSchema as TaskUpdateWithWhereUniqueWithoutTaskActionInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutTaskActionInput.schema';
import { TaskUpdateManyWithWhereWithoutTaskActionInputObjectSchema as TaskUpdateManyWithWhereWithoutTaskActionInputObjectSchema } from './TaskUpdateManyWithWhereWithoutTaskActionInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskCreateWithoutTaskActionInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskActionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutTaskActionInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutTaskActionInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutTaskActionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyTaskActionInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutTaskActionInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutTaskActionInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedUpdateManyWithoutTaskActionNestedInputObjectSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutTaskActionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutTaskActionNestedInput>;
export const TaskUncheckedUpdateManyWithoutTaskActionNestedInputObjectZodSchema = makeSchema();
