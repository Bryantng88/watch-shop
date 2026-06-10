import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeCreateWithoutTasksInputObjectSchema as TaskTypeCreateWithoutTasksInputObjectSchema } from './TaskTypeCreateWithoutTasksInput.schema';
import { TaskTypeUncheckedCreateWithoutTasksInputObjectSchema as TaskTypeUncheckedCreateWithoutTasksInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTasksInput.schema';
import { TaskTypeCreateOrConnectWithoutTasksInputObjectSchema as TaskTypeCreateOrConnectWithoutTasksInputObjectSchema } from './TaskTypeCreateOrConnectWithoutTasksInput.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './TaskTypeWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskTypeCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  connect: z.lazy(() => TaskTypeWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskTypeCreateNestedOneWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskTypeCreateNestedOneWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCreateNestedOneWithoutTasksInput>;
export const TaskTypeCreateNestedOneWithoutTasksInputObjectZodSchema = makeSchema();
