import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityCreateWithoutTaskItemInputObjectSchema as TaskItemActivityCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityCreateWithoutTaskItemInput.schema';
import { TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateOrConnectWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateOrConnectWithoutTaskItemInput>;
export const TaskItemActivityCreateOrConnectWithoutTaskItemInputObjectZodSchema = makeSchema();
