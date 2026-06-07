import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutAssignedToUserInputObjectSchema as TaskCreateWithoutAssignedToUserInputObjectSchema } from './TaskCreateWithoutAssignedToUserInput.schema';
import { TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedCreateWithoutAssignedToUserInput.schema';
import { TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema as TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './TaskCreateOrConnectWithoutAssignedToUserInput.schema';
import { TaskUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema as TaskUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './TaskUpsertWithWhereUniqueWithoutAssignedToUserInput.schema';
import { TaskCreateManyAssignedToUserInputEnvelopeObjectSchema as TaskCreateManyAssignedToUserInputEnvelopeObjectSchema } from './TaskCreateManyAssignedToUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema as TaskUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './TaskUpdateWithWhereUniqueWithoutAssignedToUserInput.schema';
import { TaskUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema as TaskUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema } from './TaskUpdateManyWithWhereWithoutAssignedToUserInput.schema';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputObjectSchema), z.lazy(() => TaskScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskUpdateManyWithoutAssignedToUserNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithoutAssignedToUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithoutAssignedToUserNestedInput>;
export const TaskUpdateManyWithoutAssignedToUserNestedInputObjectZodSchema = makeSchema();
