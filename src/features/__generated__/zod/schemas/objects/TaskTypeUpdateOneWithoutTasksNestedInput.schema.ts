import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeCreateWithoutTasksInputObjectSchema as TaskTypeCreateWithoutTasksInputObjectSchema } from './TaskTypeCreateWithoutTasksInput.schema';
import { TaskTypeUncheckedCreateWithoutTasksInputObjectSchema as TaskTypeUncheckedCreateWithoutTasksInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTasksInput.schema';
import { TaskTypeCreateOrConnectWithoutTasksInputObjectSchema as TaskTypeCreateOrConnectWithoutTasksInputObjectSchema } from './TaskTypeCreateOrConnectWithoutTasksInput.schema';
import { TaskTypeUpsertWithoutTasksInputObjectSchema as TaskTypeUpsertWithoutTasksInputObjectSchema } from './TaskTypeUpsertWithoutTasksInput.schema';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './TaskTypeWhereUniqueInput.schema';
import { TaskTypeUpdateToOneWithWhereWithoutTasksInputObjectSchema as TaskTypeUpdateToOneWithWhereWithoutTasksInputObjectSchema } from './TaskTypeUpdateToOneWithWhereWithoutTasksInput.schema';
import { TaskTypeUpdateWithoutTasksInputObjectSchema as TaskTypeUpdateWithoutTasksInputObjectSchema } from './TaskTypeUpdateWithoutTasksInput.schema';
import { TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema as TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema } from './TaskTypeUncheckedUpdateWithoutTasksInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTasksInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskTypeCreateOrConnectWithoutTasksInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskTypeUpsertWithoutTasksInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TaskTypeWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TaskTypeWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TaskTypeWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskTypeUpdateToOneWithWhereWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUpdateWithoutTasksInputObjectSchema), z.lazy(() => TaskTypeUncheckedUpdateWithoutTasksInputObjectSchema)]).optional()
}).strict();
export const TaskTypeUpdateOneWithoutTasksNestedInputObjectSchema: z.ZodType<Prisma.TaskTypeUpdateOneWithoutTasksNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUpdateOneWithoutTasksNestedInput>;
export const TaskTypeUpdateOneWithoutTasksNestedInputObjectZodSchema = makeSchema();
