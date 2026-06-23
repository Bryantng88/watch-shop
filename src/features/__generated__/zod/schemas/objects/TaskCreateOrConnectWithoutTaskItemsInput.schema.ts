import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutTaskItemsInputObjectSchema as TaskCreateWithoutTaskItemsInputObjectSchema } from './TaskCreateWithoutTaskItemsInput.schema';
import { TaskUncheckedCreateWithoutTaskItemsInputObjectSchema as TaskUncheckedCreateWithoutTaskItemsInputObjectSchema } from './TaskUncheckedCreateWithoutTaskItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskItemsInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutTaskItemsInput>;
export const TaskCreateOrConnectWithoutTaskItemsInputObjectZodSchema = makeSchema();
