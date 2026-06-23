import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemCreateWithoutTaskInputObjectSchema as TaskItemCreateWithoutTaskInputObjectSchema } from './TaskItemCreateWithoutTaskInput.schema';
import { TaskItemUncheckedCreateWithoutTaskInputObjectSchema as TaskItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateOrConnectWithoutTaskInput>;
export const TaskItemCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
