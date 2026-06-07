import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutCompletedByUserInputObjectSchema as TaskCreateWithoutCompletedByUserInputObjectSchema } from './TaskCreateWithoutCompletedByUserInput.schema';
import { TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema as TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCompletedByUserInput.schema';
import { TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema as TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema } from './TaskCreateOrConnectWithoutCompletedByUserInput.schema';
import { TaskUpsertWithWhereUniqueWithoutCompletedByUserInputObjectSchema as TaskUpsertWithWhereUniqueWithoutCompletedByUserInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutCompletedByUserInput.schema';
import { TaskCreateManyCompletedByUserInputEnvelopeObjectSchema as TaskCreateManyCompletedByUserInputEnvelopeObjectSchema } from './TaskCreateManyCompletedByUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutCompletedByUserInputObjectSchema as TaskUpdateWithWhereUniqueWithoutCompletedByUserInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutCompletedByUserInput.schema';
import { TaskUpdateManyWithWhereWithoutCompletedByUserInputObjectSchema as TaskUpdateManyWithWhereWithoutCompletedByUserInputObjectSchema } from './TaskUpdateManyWithWhereWithoutCompletedByUserInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskCreateWithoutCompletedByUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutCompletedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyCompletedByUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutCompletedByUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutCompletedByUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutCompletedByUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutCompletedByUserNestedInput>;
export const TaskUncheckedUpdateManyWithoutCompletedByUserNestedInputObjectZodSchema = makeSchema();
