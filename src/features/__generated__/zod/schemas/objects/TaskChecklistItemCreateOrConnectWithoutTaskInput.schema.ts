import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemCreateWithoutTaskInputObjectSchema as TaskChecklistItemCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemCreateWithoutTaskInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskChecklistItemCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateOrConnectWithoutTaskInput>;
export const TaskChecklistItemCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
