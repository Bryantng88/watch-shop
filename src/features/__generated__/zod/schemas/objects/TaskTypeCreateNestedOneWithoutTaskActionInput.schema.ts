import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeCreateWithoutTaskActionInputObjectSchema as TaskTypeCreateWithoutTaskActionInputObjectSchema } from './TaskTypeCreateWithoutTaskActionInput.schema';
import { TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema as TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTaskActionInput.schema';
import { TaskTypeCreateOrConnectWithoutTaskActionInputObjectSchema as TaskTypeCreateOrConnectWithoutTaskActionInputObjectSchema } from './TaskTypeCreateOrConnectWithoutTaskActionInput.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './TaskTypeWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskTypeCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  connect: z.lazy(() => TaskTypeWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskTypeCreateNestedOneWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TaskTypeCreateNestedOneWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeCreateNestedOneWithoutTaskActionInput>;
export const TaskTypeCreateNestedOneWithoutTaskActionInputObjectZodSchema = makeSchema();
