import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemCreateWithoutExecutionsInput.schema';
import { TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskChecklistItemUncheckedCreateWithoutExecutionsInput.schema';
import { TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectSchema as TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectSchema } from './TaskChecklistItemCreateOrConnectWithoutExecutionsInput.schema';
import { TaskChecklistItemWhereUniqueInputObjectSchema as TaskChecklistItemWhereUniqueInputObjectSchema } from './TaskChecklistItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskChecklistItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskChecklistItemUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskChecklistItemCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskChecklistItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemCreateNestedOneWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateNestedOneWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateNestedOneWithoutExecutionsInput>;
export const TaskChecklistItemCreateNestedOneWithoutExecutionsInputObjectZodSchema = makeSchema();
