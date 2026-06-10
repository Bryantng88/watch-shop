import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCreateWithoutTaskInputObjectSchema as TaskExecutionCreateWithoutTaskInputObjectSchema } from './TaskExecutionCreateWithoutTaskInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskExecutionCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutTaskInput>;
export const TaskExecutionCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
