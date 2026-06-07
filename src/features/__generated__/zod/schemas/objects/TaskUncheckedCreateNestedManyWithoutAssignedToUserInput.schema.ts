import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutAssignedToUserInputObjectSchema as TaskCreateWithoutAssignedToUserInputObjectSchema } from './TaskCreateWithoutAssignedToUserInput.schema';
import { TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema as TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema } from './TaskUncheckedCreateWithoutAssignedToUserInput.schema';
import { TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema as TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema } from './TaskCreateOrConnectWithoutAssignedToUserInput.schema';
import { TaskCreateManyAssignedToUserInputEnvelopeObjectSchema as TaskCreateManyAssignedToUserInputEnvelopeObjectSchema } from './TaskCreateManyAssignedToUserInputEnvelope.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskCreateWithoutAssignedToUserInputObjectSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema), z.lazy(() => TaskCreateOrConnectWithoutAssignedToUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyAssignedToUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputObjectSchema), z.lazy(() => TaskWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutAssignedToUserInput>;
export const TaskUncheckedCreateNestedManyWithoutAssignedToUserInputObjectZodSchema = makeSchema();
