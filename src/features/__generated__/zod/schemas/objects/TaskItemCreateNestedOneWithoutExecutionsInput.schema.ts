import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateWithoutExecutionsInputObjectSchema as TaskItemCreateWithoutExecutionsInputObjectSchema } from './TaskItemCreateWithoutExecutionsInput.schema';
import { TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskItemUncheckedCreateWithoutExecutionsInput.schema';
import { TaskItemCreateOrConnectWithoutExecutionsInputObjectSchema as TaskItemCreateOrConnectWithoutExecutionsInputObjectSchema } from './TaskItemCreateOrConnectWithoutExecutionsInput.schema';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemCreateOrConnectWithoutExecutionsInputObjectSchema).optional(),
  connect: z.lazy(() => TaskItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskItemCreateNestedOneWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskItemCreateNestedOneWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateNestedOneWithoutExecutionsInput>;
export const TaskItemCreateNestedOneWithoutExecutionsInputObjectZodSchema = makeSchema();
