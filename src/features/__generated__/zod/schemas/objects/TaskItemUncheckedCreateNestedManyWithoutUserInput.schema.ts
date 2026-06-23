import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutUserInputObjectSchema as TaskItemCreateWithoutUserInputObjectSchema } from './TaskItemCreateWithoutUserInput.schema';
import { TaskItemUncheckedCreateWithoutUserInputObjectSchema as TaskItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutUserInput.schema';
import { TaskItemCreateOrConnectWithoutUserInputObjectSchema as TaskItemCreateOrConnectWithoutUserInputObjectSchema } from './TaskItemCreateOrConnectWithoutUserInput.schema';
import { TaskItemCreateManyUserInputEnvelopeObjectSchema as TaskItemCreateManyUserInputEnvelopeObjectSchema } from './TaskItemCreateManyUserInputEnvelope.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskItemCreateWithoutUserInputObjectSchema).array(), z.lazy(() => TaskItemUncheckedCreateWithoutUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutUserInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemCreateOrConnectWithoutUserInputObjectSchema), z.lazy(() => TaskItemCreateOrConnectWithoutUserInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemCreateManyUserInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemUncheckedCreateNestedManyWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskItemUncheckedCreateNestedManyWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUncheckedCreateNestedManyWithoutUserInput>;
export const TaskItemUncheckedCreateNestedManyWithoutUserInputObjectZodSchema = makeSchema();
