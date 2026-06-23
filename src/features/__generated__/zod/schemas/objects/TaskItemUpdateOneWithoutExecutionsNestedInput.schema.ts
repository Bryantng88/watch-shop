import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutExecutionsInputObjectSchema as TaskItemCreateWithoutExecutionsInputObjectSchema } from './TaskItemCreateWithoutExecutionsInput.schema';
import { TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskItemUncheckedCreateWithoutExecutionsInput.schema';
import { TaskItemCreateOrConnectWithoutExecutionsInputObjectSchema as TaskItemCreateOrConnectWithoutExecutionsInputObjectSchema } from './TaskItemCreateOrConnectWithoutExecutionsInput.schema';
import { TaskItemUpsertWithoutExecutionsInputObjectSchema as TaskItemUpsertWithoutExecutionsInputObjectSchema } from './TaskItemUpsertWithoutExecutionsInput.schema';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema as TaskItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema } from './TaskItemUpdateToOneWithWhereWithoutExecutionsInput.schema';
import { TaskItemUpdateWithoutExecutionsInputObjectSchema as TaskItemUpdateWithoutExecutionsInputObjectSchema } from './TaskItemUpdateWithoutExecutionsInput.schema';
import { TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema as TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema } from './TaskItemUncheckedUpdateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  upsert: z.lazy(() => TaskItemUpsertWithoutExecutionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => TaskItemWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => TaskItemWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => TaskItemWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => TaskItemUpdateToOneWithWhereWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUpdateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUncheckedUpdateWithoutExecutionsInputObjectSchema)]).optional()
}).strict();
export const TaskItemUpdateOneWithoutExecutionsNestedInputObjectSchema: z.ZodType<Prisma.TaskItemUpdateOneWithoutExecutionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUpdateOneWithoutExecutionsNestedInput>;
export const TaskItemUpdateOneWithoutExecutionsNestedInputObjectZodSchema = makeSchema();
