import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutChecklistsInputObjectSchema as TaskItemCreateWithoutChecklistsInputObjectSchema } from './TaskItemCreateWithoutChecklistsInput.schema';
import { TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema as TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema } from './TaskItemUncheckedCreateWithoutChecklistsInput.schema';
import { TaskItemCreateOrConnectWithoutChecklistsInputObjectSchema as TaskItemCreateOrConnectWithoutChecklistsInputObjectSchema } from './TaskItemCreateOrConnectWithoutChecklistsInput.schema';
import { TaskItemUpsertWithoutChecklistsInputObjectSchema as TaskItemUpsertWithoutChecklistsInputObjectSchema } from './TaskItemUpsertWithoutChecklistsInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateToOneWithWhereWithoutChecklistsInputObjectSchema as TaskItemUpdateToOneWithWhereWithoutChecklistsInputObjectSchema } from './TaskItemUpdateToOneWithWhereWithoutChecklistsInput.schema';
import { TaskItemUpdateWithoutChecklistsInputObjectSchema as TaskItemUpdateWithoutChecklistsInputObjectSchema } from './TaskItemUpdateWithoutChecklistsInput.schema';
import { TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema as TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema } from './TaskItemUncheckedUpdateWithoutChecklistsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutChecklistsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemCreateOrConnectWithoutChecklistsInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskItemUpsertWithoutChecklistsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskItemUpdateToOneWithWhereWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUpdateWithoutChecklistsInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutChecklistsInputObjectSchema)]).optional()
}).strict();
export const TaskItemUpdateOneRequiredWithoutChecklistsNestedInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateOneRequiredWithoutChecklistsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateOneRequiredWithoutChecklistsNestedInput>;
export const TaskItemUpdateOneRequiredWithoutChecklistsNestedInputObjectZodSchema = makeSchema();
