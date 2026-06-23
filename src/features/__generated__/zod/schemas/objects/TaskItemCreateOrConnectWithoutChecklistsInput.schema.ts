import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemCreateWithoutChecklistsInputObjectSchema as TaskItemCreateWithoutChecklistsInputObjectSchema } from './TaskItemCreateWithoutChecklistsInput.schema';
import { TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema as TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema } from './TaskItemUncheckedCreateWithoutChecklistsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemCreateWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema)])
}).strict();
export const TaskItemCreateOrConnectWithoutChecklistsInputObjectSchema: z.ZodType<Prisma.TaskItemCreateOrConnectWithoutChecklistsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateOrConnectWithoutChecklistsInput>;
export const TaskItemCreateOrConnectWithoutChecklistsInputObjectZodSchema = makeSchema();
