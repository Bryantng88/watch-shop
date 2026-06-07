import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutWatchInputObjectSchema as TaskCreateWithoutWatchInputObjectSchema } from './TaskCreateWithoutWatchInput.schema';
import { TaskUncheckedCreateWithoutWatchInputObjectSchema as TaskUncheckedCreateWithoutWatchInputObjectSchema } from './TaskUncheckedCreateWithoutWatchInput.schema';
import { TaskCreateOrConnectWithoutWatchInputObjectSchema as TaskCreateOrConnectWithoutWatchInputObjectSchema } from './TaskCreateOrConnectWithoutWatchInput.schema';
import { TaskUpsertWithWhereUniqueWithoutWatchInputObjectSchema as TaskUpsertWithWhereUniqueWithoutWatchInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutWatchInput.schema';
import { TaskCreateManyWatchInputEnvelopeObjectSchema as TaskCreateManyWatchInputEnvelopeObjectSchema } from './TaskCreateManyWatchInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutWatchInputObjectSchema as TaskUpdateWithWhereUniqueWithoutWatchInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutWatchInput.schema';
import { TaskUpdateManyWithWhereWithoutWatchInputObjectSchema as TaskUpdateManyWithWhereWithoutWatchInputObjectSchema } from './TaskUpdateManyWithWhereWithoutWatchInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutWatchInputObjectSchema), z.lazy(() => TaskCreateWithoutWatchInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutWatchInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWatchInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutWatchInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutWatchInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyWatchInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutWatchInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutWatchInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutWatchInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutWatchInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutWatchNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutWatchNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutWatchNestedInput>;
export const TaskUpdateManyWithoutWatchNestedInputObjectZodSchema = makeSchema();
