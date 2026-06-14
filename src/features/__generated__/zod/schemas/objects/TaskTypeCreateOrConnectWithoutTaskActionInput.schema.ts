import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './TaskTypeWhereUniqueInput.schema';
import { TaskTypeCreateWithoutTaskActionInputObjectSchema as TaskTypeCreateWithoutTaskActionInputObjectSchema } from './TaskTypeCreateWithoutTaskActionInput.schema';
import { TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema as TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskTypeWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema)])
}).strict();
export const TaskTypeCreateOrConnectWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskTypeCreateOrConnectWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCreateOrConnectWithoutTaskActionInput>;
export const TaskTypeCreateOrConnectWithoutTaskActionInputObjectZodSchema = makeSchema();
