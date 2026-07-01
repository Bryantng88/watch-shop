import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateWithoutTaskItemInputObjectSchema as TaskItemActivityCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityCreateWithoutTaskItemInput.schema';
import { TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutTaskItemInput.schema';
import { TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema as TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema } from './TaskItemActivityCreateOrConnectWithoutTaskItemInput.schema';
import { TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema as TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema } from './TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInput.schema';
import { TaskItemActivityCreateManyTaskItemInputEnvelopeObjectSchema as TaskItemActivityCreateManyTaskItemInputEnvelopeObjectSchema } from './TaskItemActivityCreateManyTaskItemInputEnvelope.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema as TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema } from './TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInput.schema';
import { TaskItemActivityUpdateManyWithWhereWithoutTaskItemInputObjectSchema as TaskItemActivityUpdateManyWithWhereWithoutTaskItemInputObjectSchema } from './TaskItemActivityUpdateManyWithWhereWithoutTaskItemInput.schema';
import { TaskItemActivityScalarWhereInputObjectSchema as TaskItemActivityScalarWhereInputObjectSchema } from './TaskItemActivityScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityCreateWithoutTaskItemInputObjectSchema).array(), z.lazy(() => TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUpsertWithWhereUniqueWithoutTaskItemInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemActivityCreateManyTaskItemInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema), z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUpdateWithWhereUniqueWithoutTaskItemInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemActivityUpdateManyWithWhereWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUpdateManyWithWhereWithoutTaskItemInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemActivityUncheckedUpdateManyWithoutTaskItemNestedInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUncheckedUpdateManyWithoutTaskItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUncheckedUpdateManyWithoutTaskItemNestedInput>;
export const TaskItemActivityUncheckedUpdateManyWithoutTaskItemNestedInputObjectZodSchema = makeSchema();
