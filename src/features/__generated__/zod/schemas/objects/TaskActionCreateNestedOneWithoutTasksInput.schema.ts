import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateWithoutTasksInputObjectSchema as TaskActionCreateWithoutTasksInputObjectSchema } from './TaskActionCreateWithoutTasksInput.schema';
import { TaskActionUncheckedCreateWithoutTasksInputObjectSchema as TaskActionUncheckedCreateWithoutTasksInputObjectSchema } from './TaskActionUncheckedCreateWithoutTasksInput.schema';
import { TaskActionCreateOrConnectWithoutTasksInputObjectSchema as TaskActionCreateOrConnectWithoutTasksInputObjectSchema } from './TaskActionCreateOrConnectWithoutTasksInput.schema';
import { TaskActionWhereUniqueInputObjectSchema as TaskActionWhereUniqueInputObjectSchema } from './TaskActionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskActionCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskActionUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskActionCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  connect: z.lazy(() => TaskActionWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskActionCreateNestedOneWithoutTasksInputObjectSchema: z.ZodType<Prisma.TaskActionCreateNestedOneWithoutTasksInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionCreateNestedOneWithoutTasksInput>;
export const TaskActionCreateNestedOneWithoutTasksInputObjectZodSchema = makeSchema();
