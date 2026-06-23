import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutTaskInputObjectSchema as TaskItemCreateWithoutTaskInputObjectSchema } from './TaskItemCreateWithoutTaskInput.schema';
import { TaskItemUncheckedCreateWithoutTaskInputObjectSchema as TaskItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemUncheckedCreateWithoutTaskInput.schema';
import { TaskItemCreateOrConnectWithoutTaskInputObjectSchema as TaskItemCreateOrConnectWithoutTaskInputObjectSchema } from './TaskItemCreateOrConnectWithoutTaskInput.schema';
import { TaskItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema as TaskItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskItemUpsertWithWhereUniqueWithoutTaskInput.schema';
import { TaskItemCreateManyTaskInputEnvelopeObjectSchema as TaskItemCreateManyTaskInputEnvelopeObjectSchema } from './TaskItemCreateManyTaskInputEnvelope.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema as TaskItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskItemUpdateWithWhereUniqueWithoutTaskInput.schema';
import { TaskItemUpdateManyWithWhereWithoutTaskInputObjectSchema as TaskItemUpdateManyWithWhereWithoutTaskInputObjectSchema } from './TaskItemUpdateManyWithWhereWithoutTaskInput.schema';
import { TaskItemScalarWhereInputObjectSchema as TaskItemScalarWhereInputObjectSchema } from './TaskItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskItemUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskItemCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemCreateManyTaskInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemUpdateManyWithWhereWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUpdateManyWithWhereWithoutTaskInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemScalarWhereInputObjectSchema), z.lazy(() => TaskItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemUncheckedUpdateManyWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.TaskItemUncheckedUpdateManyWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUncheckedUpdateManyWithoutTaskNestedInput>;
export const TaskItemUncheckedUpdateManyWithoutTaskNestedInputObjectZodSchema = makeSchema();
