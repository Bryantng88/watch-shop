import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutCancelledByUserInputObjectSchema as TaskCreateWithoutCancelledByUserInputObjectSchema } from './TaskCreateWithoutCancelledByUserInput.schema';
import { TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema as TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCancelledByUserInput.schema';
import { TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema as TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema } from './TaskCreateOrConnectWithoutCancelledByUserInput.schema';
import { TaskUpsertWithWhereUniqueWithoutCancelledByUserInputObjectSchema as TaskUpsertWithWhereUniqueWithoutCancelledByUserInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutCancelledByUserInput.schema';
import { TaskCreateManyCancelledByUserInputEnvelopeObjectSchema as TaskCreateManyCancelledByUserInputEnvelopeObjectSchema } from './TaskCreateManyCancelledByUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutCancelledByUserInputObjectSchema as TaskUpdateWithWhereUniqueWithoutCancelledByUserInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutCancelledByUserInput.schema';
import { TaskUpdateManyWithWhereWithoutCancelledByUserInputObjectSchema as TaskUpdateManyWithWhereWithoutCancelledByUserInputObjectSchema } from './TaskUpdateManyWithWhereWithoutCancelledByUserInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskCreateWithoutCancelledByUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCancelledByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutCancelledByUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutCancelledByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyCancelledByUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutCancelledByUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutCancelledByUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutCancelledByUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutCancelledByUserNestedInput>;
export const TaskUncheckedUpdateManyWithoutCancelledByUserNestedInputObjectZodSchema = makeSchema();
