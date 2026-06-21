import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutUserInputObjectSchema as TaskChecklistItemCreateWithoutUserInputObjectSchema } from './TaskChecklistItemCreateWithoutUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutUserInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutUserInput.schema';
import { TaskChecklistItemUpsertWithWhereUniqueWithoutUserInputObjectSchema as TaskChecklistItemUpsertWithWhereUniqueWithoutUserInputObjectSchema } from './TaskChecklistItemUpsertWithWhereUniqueWithoutUserInput.schema';
import { TaskChecklistItemCreateManyUserInputEnvelopeObjectSchema as TaskChecklistItemCreateManyUserInputEnvelopeObjectSchema } from './TaskChecklistItemCreateManyUserInputEnvelope.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithWhereUniqueWithoutUserInputObjectSchema as TaskChecklistItemUpdateWithWhereUniqueWithoutUserInputObjectSchema } from './TaskChecklistItemUpdateWithWhereUniqueWithoutUserInput.schema';
import { TaskChecklistItemUpdateManyWithWhereWithoutUserInputObjectSchema as TaskChecklistItemUpdateManyWithWhereWithoutUserInputObjectSchema } from './TaskChecklistItemUpdateManyWithWhereWithoutUserInput.schema';
import { TaskChecklistItemScalarWhereInputObjectSchema as TaskChecklistItemScalarWhereInputObjectSchema } from './TaskChecklistItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateWithoutUserInputObjectSchema).array(), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskChecklistItemUpsertWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUpsertWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskChecklistItemCreateManyUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskChecklistItemUpdateWithWhereUniqueWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUpdateWithWhereUniqueWithoutUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskChecklistItemUpdateManyWithWhereWithoutUserInputObjectSchema), z.lazy(() => TaskChecklistItemUpdateManyWithWhereWithoutUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema), z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskChecklistItemUncheckedUpdateManyWithoutUserNestedInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUncheckedUpdateManyWithoutUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUncheckedUpdateManyWithoutUserNestedInput>;
export const TaskChecklistItemUncheckedUpdateManyWithoutUserNestedInputObjectZodSchema = makeSchema();
