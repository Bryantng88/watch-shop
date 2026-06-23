import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutTaskItemsInputObjectSchema as TaskCreateWithoutTaskItemsInputObjectSchema } from './TaskCreateWithoutTaskItemsInput.schema';
import { TaskUncheckedCreateWithoutTaskItemsInputObjectSchema as TaskUncheckedCreateWithoutTaskItemsInputObjectSchema } from './TaskUncheckedCreateWithoutTaskItemsInput.schema';
import { TaskCreateOrConnectWithoutTaskItemsInputObjectSchema as TaskCreateOrConnectWithoutTaskItemsInputObjectSchema } from './TaskCreateOrConnectWithoutTaskItemsInput.schema';
import { TaskUpsertWithoutTaskItemsInputObjectSchema as TaskUpsertWithoutTaskItemsInputObjectSchema } from './TaskUpsertWithoutTaskItemsInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema as TaskUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema } from './TaskUpdateToOneWithWhereWithoutTaskItemsInput.schema';
import { TaskUpdateWithoutTaskItemsInputObjectSchema as TaskUpdateWithoutTaskItemsInputObjectSchema } from './TaskUpdateWithoutTaskItemsInput.schema';
import { TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema as TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema } from './TaskUncheckedUpdateWithoutTaskItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutTaskItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskUpsertWithoutTaskItemsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskUpdateToOneWithWhereWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUpdateWithoutTaskItemsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutTaskItemsInputObjectSchema)]).optional()
}).strict();
export const TaskUpdateOneRequiredWithoutTaskItemsNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateOneRequiredWithoutTaskItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateOneRequiredWithoutTaskItemsNestedInput>;
export const TaskUpdateOneRequiredWithoutTaskItemsNestedInputObjectZodSchema = makeSchema();
