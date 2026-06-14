import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeCreateWithoutTaskActionInputObjectSchema as TaskTypeCreateWithoutTaskActionInputObjectSchema } from './TaskTypeCreateWithoutTaskActionInput.schema';
import { TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema as TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema } from './TaskTypeUncheckedCreateWithoutTaskActionInput.schema';
import { TaskTypeCreateOrConnectWithoutTaskActionInputObjectSchema as TaskTypeCreateOrConnectWithoutTaskActionInputObjectSchema } from './TaskTypeCreateOrConnectWithoutTaskActionInput.schema';
import { TaskTypeUpsertWithoutTaskActionInputObjectSchema as TaskTypeUpsertWithoutTaskActionInputObjectSchema } from './TaskTypeUpsertWithoutTaskActionInput.schema';
import { TaskTypeWhereUniqueInputObjectSchema as TaskTypeWhereUniqueInputObjectSchema } from './TaskTypeWhereUniqueInput.schema';
import { TaskTypeUpdateToOneWithWhereWithoutTaskActionInputObjectSchema as TaskTypeUpdateToOneWithWhereWithoutTaskActionInputObjectSchema } from './TaskTypeUpdateToOneWithWhereWithoutTaskActionInput.schema';
import { TaskTypeUpdateWithoutTaskActionInputObjectSchema as TaskTypeUpdateWithoutTaskActionInputObjectSchema } from './TaskTypeUpdateWithoutTaskActionInput.schema';
import { TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema as TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema } from './TaskTypeUncheckedUpdateWithoutTaskActionInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskTypeCreateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUncheckedCreateWithoutTaskActionInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskTypeCreateOrConnectWithoutTaskActionInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskTypeUpsertWithoutTaskActionInputObjectSchema).optional(),
  connect: z.lazy(() => TaskTypeWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskTypeUpdateToOneWithWhereWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUpdateWithoutTaskActionInputObjectSchema), z.lazy(() => TaskTypeUncheckedUpdateWithoutTaskActionInputObjectSchema)]).optional()
}).strict();
export const TaskTypeUpdateOneRequiredWithoutTaskActionNestedInputObjectSchema: z.ZodType<Prisma.TaskTypeUpdateOneRequiredWithoutTaskActionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeUpdateOneRequiredWithoutTaskActionNestedInput>;
export const TaskTypeUpdateOneRequiredWithoutTaskActionNestedInputObjectZodSchema = makeSchema();
