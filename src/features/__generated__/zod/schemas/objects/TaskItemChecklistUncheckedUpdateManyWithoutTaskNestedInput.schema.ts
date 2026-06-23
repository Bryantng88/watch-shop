import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistCreateWithoutTaskInputObjectSchema as TaskItemChecklistCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskInput.schema';
import { TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema as TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema } from './TaskItemChecklistCreateOrConnectWithoutTaskInput.schema';
import { TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInputObjectSchema as TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInput.schema';
import { TaskItemChecklistCreateManyTaskInputEnvelopeObjectSchema as TaskItemChecklistCreateManyTaskInputEnvelopeObjectSchema } from './TaskItemChecklistCreateManyTaskInputEnvelope.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInputObjectSchema as TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInput.schema';
import { TaskItemChecklistUpdateManyWithWhereWithoutTaskInputObjectSchema as TaskItemChecklistUpdateManyWithWhereWithoutTaskInputObjectSchema } from './TaskItemChecklistUpdateManyWithWhereWithoutTaskInput.schema';
import { TaskItemChecklistScalarWhereInputObjectSchema as TaskItemChecklistScalarWhereInputObjectSchema } from './TaskItemChecklistScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUpsertWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemChecklistCreateManyTaskInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUpdateWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemChecklistUpdateManyWithWhereWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUpdateManyWithWhereWithoutTaskInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema), z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemChecklistUncheckedUpdateManyWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUncheckedUpdateManyWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUncheckedUpdateManyWithoutTaskNestedInput>;
export const TaskItemChecklistUncheckedUpdateManyWithoutTaskNestedInputObjectZodSchema = makeSchema();
