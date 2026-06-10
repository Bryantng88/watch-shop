import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './TaskTypeWhereUniqueInput.schema';
import { TaskTypeCreateWithoutTasksInputObjectSchema as TaskTypeCreateWithoutTasksInputObjectSchema } from './TaskTypeCreateWithoutTasksInput.schema';
import { TaskTypeUncheckedCreateWithoutTasksInputObjectSchema as TaskTypeUncheckedCreateWithoutTasksInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskTypeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTasksInputObjectSchema)])
}).strict();
export const TaskTypeCreateOrConnectWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskTypeCreateOrConnectWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCreateOrConnectWithoutTasksInput>;
export const TaskTypeCreateOrConnectWithoutTasksInputObjectZodSchema = makeSchema();
