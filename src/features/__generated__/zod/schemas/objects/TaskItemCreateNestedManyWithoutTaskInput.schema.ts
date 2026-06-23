import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutTaskInputObjectSchema as TaskItemCreateWithoutTaskInputObjectSchema } from './TaskItemCreateWithoutTaskInput.schema';
import { TaskItemUncheckedCreateWithoutTaskInputObjectSchema as TaskItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemUncheckedCreateWithoutTaskInput.schema';
import { TaskItemCreateOrConnectWithoutTaskInputObjectSchema as TaskItemCreateOrConnectWithoutTaskInputObjectSchema } from './TaskItemCreateOrConnectWithoutTaskInput.schema';
import { TaskItemCreateManyTaskInputEnvelopeObjectSchema as TaskItemCreateManyTaskInputEnvelopeObjectSchema } from './TaskItemCreateManyTaskInputEnvelope.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskItemUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskItemCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskItemCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskItemCreateManyTaskInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskItemWhereUniqueInputObjectSchema), z.lazy(() => TaskItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskItemCreateNestedManyWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemCreateNestedManyWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateNestedManyWithoutTaskInput>;
export const TaskItemCreateNestedManyWithoutTaskInputObjectZodSchema = makeSchema();
