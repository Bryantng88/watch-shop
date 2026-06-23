import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskItemInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskItemInput.schema';
import { TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateOrConnectWithoutTaskItemInput.schema';
import { TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema as TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInput.schema';
import { TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectSchema as TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectSchema } from './TaskItemChecklistCreateManyTaskItemInputEnvelope.schema';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema as TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInput.schema';
import { TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInputObjectSchema as TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInput.schema';
import { TaskItemChecklistScalarWhereInputObjectSchema as TaskItemChecklistScalarWhereInputObjectSchema } from './TaskItemChecklistScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistCreateWithoutTaskItemInputObjectSchema).array(), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemChecklistCreateManyTaskItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema), z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUpdateManyWithWhereWithoutTaskItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema), z.lazy(() => TaskItemChecklistScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemChecklistUpdateManyWithoutTaskItemNestedInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistUpdateManyWithoutTaskItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistUpdateManyWithoutTaskItemNestedInput>;
export const TaskItemChecklistUpdateManyWithoutTaskItemNestedInputObjectZodSchema = makeSchema();
