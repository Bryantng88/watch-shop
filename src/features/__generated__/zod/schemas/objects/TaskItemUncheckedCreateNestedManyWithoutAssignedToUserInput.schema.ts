import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutAssignedToUserInputObjectSchema as TaskItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemCreateWithoutAssignedToUserInput.schema';
import { TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutAssignedToUserInput.schema';
import { TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema as TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './TaskItemCreateOrConnectWithoutAssignedToUserInput.schema';
import { TaskItemCreateManyAssignedToUserInputEnvelopeObjectSchema as TaskItemCreateManyAssignedToUserInputEnvelopeObjectSchema } from './TaskItemCreateManyAssignedToUserInputEnvelope.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskItemCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInput>;
export const TaskItemUncheckedCreateNestedManyWithoutAssignedToUserInputObjectZodSchema = makeSchema();
