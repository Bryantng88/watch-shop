import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutCreatedByUserInputObjectSchema as TaskCreateWithoutCreatedByUserInputObjectSchema } from './TaskCreateWithoutCreatedByUserInput.schema';
import { TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCreatedByUserInput.schema';
import { TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema as TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema } from './TaskCreateOrConnectWithoutCreatedByUserInput.schema';
import { TaskUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema as TaskUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutCreatedByUserInput.schema';
import { TaskCreateManyCreatedByUserInputEnvelopeObjectSchema as TaskCreateManyCreatedByUserInputEnvelopeObjectSchema } from './TaskCreateManyCreatedByUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema as TaskUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutCreatedByUserInput.schema';
import { TaskUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema as TaskUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema } from './TaskUpdateManyWithWhereWithoutCreatedByUserInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskCreateWithoutCreatedByUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyCreatedByUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutCreatedByUserNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutCreatedByUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutCreatedByUserNestedInput>;
export const TaskUpdateManyWithoutCreatedByUserNestedInputObjectZodSchema = makeSchema();
