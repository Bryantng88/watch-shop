import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCreateWithoutTaskItemInputObjectSchema as TaskExecutionCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionCreateWithoutTaskItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskExecutionCreateOrConnectWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutTaskItemInput>;
export const TaskExecutionCreateOrConnectWithoutTaskItemInputObjectZodSchema = makeSchema();
