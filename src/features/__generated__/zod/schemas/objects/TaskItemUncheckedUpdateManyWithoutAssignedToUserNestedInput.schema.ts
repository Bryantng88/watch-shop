import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutAssignedToUserInputObjectSchema as TaskItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemCreateWithoutAssignedToUserInput.schema';
import { TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutAssignedToUserInput.schema';
import { TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema as TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './TaskItemCreateOrConnectWithoutAssignedToUserInput.schema';
import { TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema as TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInput.schema';
import { TaskItemCreateManyAssignedToUserInputEnvelopeObjectSchema as TaskItemCreateManyAssignedToUserInputEnvelopeObjectSchema } from './TaskItemCreateManyAssignedToUserInputEnvelope.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema as TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInput.schema';
import { TaskItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema as TaskItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema } from './TaskItemUpdateManyWithWhereWithoutAssignedToUserInput.schema';
import { TaskItemScalarWhereInputObjectSchema as TaskItemScalarWhereInputObjectSchema } from './TaskItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskItemScalarWhereInputObjectSchema), z.lazy(() => TaskItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectSchema: z.ZodType<Prisma.TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInput>;
export const TaskItemUncheckedUpdateManyWithoutAssignedToUserNestedInputObjectZodSchema = makeSchema();
