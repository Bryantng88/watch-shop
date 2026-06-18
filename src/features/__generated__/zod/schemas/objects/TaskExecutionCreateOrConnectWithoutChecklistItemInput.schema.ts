import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCreateWithoutChecklistItemInputObjectSchema as TaskExecutionCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateWithoutChecklistItemInput.schema';
import { TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutChecklistItemInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutChecklistItemInputObjectSchema)])
}).strict();
export const TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutChecklistItemInput>;
export const TaskExecutionCreateOrConnectWithoutChecklistItemInputObjectZodSchema = makeSchema();
