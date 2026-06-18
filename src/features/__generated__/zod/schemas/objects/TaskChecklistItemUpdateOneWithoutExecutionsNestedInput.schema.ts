import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemCreateWithoutExecutionsInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutExecutionsInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutExecutionsInput.schema';
import { TaskChecklistItemUpsertWithoutExecutionsInputObjectSchema as TaskChecklistItemUpsertWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUpsertWithoutExecutionsInput.schema';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './TaskChecklistItemWhereInput.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema';
import { TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema as TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInput.schema';
import { TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema as TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUpdateWithoutExecutionsInput.schema';
import { TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskChecklistItemUpsertWithoutExecutionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TaskChecklistItemWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TaskChecklistItemWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskChecklistItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedUpdateWithoutExecutionsInputObjectSchema)]).optional()
}).strict();
export const TaskChecklistItemUpdateOneWithoutExecutionsNestedInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUpdateOneWithoutExecutionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUpdateOneWithoutExecutionsNestedInput>;
export const TaskChecklistItemUpdateOneWithoutExecutionsNestedInputObjectZodSchema = makeSchema();
