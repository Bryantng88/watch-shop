import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistCreateWithoutTaskInputObjectSchema as TaskItemChecklistCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskItemChecklistCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateOrConnectWithoutTaskInput>;
export const TaskItemChecklistCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
