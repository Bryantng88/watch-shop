import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemCreateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutAssignedToUserInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutAssignedToUserInput.schema';
import { TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectSchema as TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectSchema } from './TaskChecklistItemCreateManyAssignedToUserInputEnvelope.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskChecklistItemCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskChecklistItemCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema), z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskChecklistItemCreateNestedManyWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateNestedManyWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateNestedManyWithoutAssignedToUserInput>;
export const TaskChecklistItemCreateNestedManyWithoutAssignedToUserInputObjectZodSchema = makeSchema();
