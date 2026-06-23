import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistWhereUniqueInputObjectSchema as TaskItemChecklistWhereUniqueInputObjectSchema } from './TaskItemChecklistWhereUniqueInput.schema';
import { TaskItemChecklistCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateWithoutTaskItemInput.schema';
import { TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedCreateWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemChecklistWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemChecklistCreateWithoutTaskItemInputObjectSchema), z.lazy(() => TaskItemChecklistUncheckedCreateWithoutTaskItemInputObjectSchema)])
}).strict();
export const TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateOrConnectWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateOrConnectWithoutTaskItemInput>;
export const TaskItemChecklistCreateOrConnectWithoutTaskItemInputObjectZodSchema = makeSchema();
