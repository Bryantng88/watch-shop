import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTaskItemsInputObjectSchema as TaskCreateWithoutTaskItemsInputObjectSchema } from './TaskCreateWithoutTaskItemsInput.schema';
import { TaskUncheckedCreateWithoutTaskItemsInputObjectSchema as TaskUncheckedCreateWithoutTaskItemsInputObjectSchema } from './TaskUncheckedCreateWithoutTaskItemsInput.schema';
import { TaskCreateOrConnectWithoutTaskItemsInputObjectSchema as TaskCreateOrConnectWithoutTaskItemsInputObjectSchema } from './TaskCreateOrConnectWithoutTaskItemsInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutTaskItemsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskCreateNestedOneWithoutTaskItemsInputObjectSchema: z.ZodType<Prisma.TaskCreateNestedOneWithoutTaskItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateNestedOneWithoutTaskItemsInput>;
export const TaskCreateNestedOneWithoutTaskItemsInputObjectZodSchema = makeSchema();
