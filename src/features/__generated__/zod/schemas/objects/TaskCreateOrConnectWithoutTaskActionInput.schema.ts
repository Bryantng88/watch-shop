import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutTaskActionInputObjectSchema as TaskCreateWithoutTaskActionInputObjectSchema } from './TaskCreateWithoutTaskActionInput.schema';
import { TaskUncheckedCreateWithoutTaskActionInputObjectSchema as TaskUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskUncheckedCreateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskActionInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutTaskActionInput>;
export const TaskCreateOrConnectWithoutTaskActionInputObjectZodSchema = makeSchema();
