import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateWithoutChecklistItemsInputObjectSchema as TaskCreateWithoutChecklistItemsInputObjectSchema } from './TaskCreateWithoutChecklistItemsInput.schema';
import { TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema as TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema } from './TaskUncheckedCreateWithoutChecklistItemsInput.schema';
import { TaskCreateOrConnectWithoutChecklistItemsInputObjectSchema as TaskCreateOrConnectWithoutChecklistItemsInputObjectSchema } from './TaskCreateOrConnectWithoutChecklistItemsInput.schema';
import { TaskUpsertWithoutChecklistItemsInputObjectSchema as TaskUpsertWithoutChecklistItemsInputObjectSchema } from './TaskUpsertWithoutChecklistItemsInput.schema';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateToOneWithWhereWithoutChecklistItemsInputObjectSchema as TaskUpdateToOneWithWhereWithoutChecklistItemsInputObjectSchema } from './TaskUpdateToOneWithWhereWithoutChecklistItemsInput.schema';
import { TaskUpdateWithoutChecklistItemsInputObjectSchema as TaskUpdateWithoutChecklistItemsInputObjectSchema } from './TaskUpdateWithoutChecklistItemsInput.schema';
import { TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema as TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema } from './TaskUncheckedUpdateWithoutChecklistItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutChecklistItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutChecklistItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskUpsertWithoutChecklistItemsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskUpdateToOneWithWhereWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUpdateWithoutChecklistItemsInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutChecklistItemsInputObjectSchema)]).optional()
}).strict();
export const TaskUpdateOneRequiredWithoutChecklistItemsNestedInputObjectSchema: z.ZodType<Prisma.TaskUpdateOneRequiredWithoutChecklistItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateOneRequiredWithoutChecklistItemsNestedInput>;
export const TaskUpdateOneRequiredWithoutChecklistItemsNestedInputObjectZodSchema = makeSchema();
