import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutChecklistItemsInputObjectSchema as TaskCreateWithoutChecklistItemsInputObjectSchema } from './TaskCreateWithoutChecklistItemsInput.schema';
import { TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema as TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema } from './TaskUncheckedCreateWithoutChecklistItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutChecklistItemsInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutChecklistItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutChecklistItemsInput>;
export const TaskCreateOrConnectWithoutChecklistItemsInputObjectZodSchema = makeSchema();
