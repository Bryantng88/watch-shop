import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutTaskInputObjectSchema as TaskChecklistItemCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemCreateWithoutTaskInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutTaskInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutTaskInput.schema';
import { TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema as TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInput.schema';
import { TaskChecklistItemCreateManyTaskInputEnvelopeObjectSchema as TaskChecklistItemCreateManyTaskInputEnvelopeObjectSchema } from './TaskChecklistItemCreateManyTaskInputEnvelope.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema as TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInput.schema';
import { TaskChecklistItemUpdateManyWithWhereWithoutTaskInputObjectSchema as TaskChecklistItemUpdateManyWithWhereWithoutTaskInputObjectSchema } from './TaskChecklistItemUpdateManyWithWhereWithoutTaskInput.schema';
import { TaskChecklistItemScalarWhereInputObjectSchema as TaskChecklistItemScalarWhereInputObjectSchema } from './TaskChecklistItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUpsertWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskChecklistItemCreateManyTaskInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUpdateWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskChecklistItemUpdateManyWithWhereWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUpdateManyWithWhereWithoutTaskInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema), z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskChecklistItemUpdateManyWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateManyWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateManyWithoutTaskNestedInput>;
export const TaskChecklistItemUpdateManyWithoutTaskNestedInputObjectZodSchema = makeSchema();
