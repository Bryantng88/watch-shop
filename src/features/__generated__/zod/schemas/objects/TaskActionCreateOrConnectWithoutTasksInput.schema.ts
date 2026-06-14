import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema';
import { TaskActionCreateWithoutTasksInputObjectSchema as TaskActionCreateWithoutTasksInputObjectSchema } from './TaskActionCreateWithoutTasksInput.schema';
import { TaskActionUncheckedCreateWithoutTasksInputObjectSchema as TaskActionUncheckedCreateWithoutTasksInputObjectSchema } from './TaskActionUncheckedCreateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskActionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskActionCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTasksInputObjectSchema)])
}).strict();
export const TaskActionCreateOrConnectWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskActionCreateOrConnectWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateOrConnectWithoutTasksInput>;
export const TaskActionCreateOrConnectWithoutTasksInputObjectZodSchema = makeSchema();
