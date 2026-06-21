import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemCreateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInput.schema';
import { TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectSchema as TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectSchema } from './TaskChecklistItemCreateManyAssignedToUserInputEnvelope.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInput.schema';
import { TaskChecklistItemScalarWhereInputObjectSchema as TaskChecklistItemScalarWhereInputObjectSchema } from './TaskChecklistItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUpsertWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUpdateWithWhereUniqueWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUpdateManyWithWhereWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema), z.lazy(() => TaskChecklistItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskChecklistItemUpdateManyWithoutAssignedToUserNestedInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateManyWithoutAssignedToUserNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateManyWithoutAssignedToUserNestedInput>;
export const TaskChecklistItemUpdateManyWithoutAssignedToUserNestedInputObjectZodSchema = makeSchema();
