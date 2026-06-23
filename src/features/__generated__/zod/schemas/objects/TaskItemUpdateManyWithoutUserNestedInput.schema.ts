import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutUserInputObjectSchema as TaskItemCreateWithoutUserInputObjectSchema } from './TaskItemCreateWithoutUserInput.schema';
import { TaskItemUncheckedCreateWithoutUserInputObjectSchema as TaskItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutUserInput.schema';
import { TaskItemCreateOrConnectWithoutUserInputObjectSchema as TaskItemCreateOrConnectWithoutUserInputObjectSchema } from './TaskItemCreateOrConnectWithoutUserInput.schema';
import { TaskItemUpsertWithWhereUniqueWithoutUserInputObjectSchema as TaskItemUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './TaskItemUpsertWithWhereUniqueWithoutUserInput.schema';
import { TaskItemCreateManyUserInputEnvelopeObjectSchema as TaskItemCreateManyUserInputEnvelopeObjectSchema } from './TaskItemCreateManyUserInputEnvelope.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithWhereUniqueWithoutUserInputObjectSchema as TaskItemUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './TaskItemUpdateWithWhereUniqueWithoutUserInput.schema';
import { TaskItemUpdateManyWithWhereWithoutUserInputObjectSchema as TaskItemUpdateManyWithWhereWithoutUserInputObjectSchema } from './TaskItemUpdateManyWithWhereWithoutUserInput.schema';
import { TaskItemScalarWhereInputObjectSchema as TaskItemScalarWhereInputObjectSchema } from './TaskItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskItemCreateWithoutUserInputObjectSchema).array(), z.lazy(() => TaskItemUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => TaskItemCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => TaskItemUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => TaskItemUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => TaskItemUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemScalarWhereInputObjectSchema), z.lazy(() => TaskItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateManyWithoutUserNestedInput>;
export const TaskItemUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
