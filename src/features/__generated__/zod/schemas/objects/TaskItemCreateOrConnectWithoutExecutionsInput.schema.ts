import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemCreateWithoutExecutionsInputObjectSchema as TaskItemCreateWithoutExecutionsInputObjectSchema } from './TaskItemCreateWithoutExecutionsInput.schema';
import { TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema as TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskItemUncheckedCreateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema)])
}).strict();
export const TaskItemCreateOrConnectWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskItemCreateOrConnectWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateOrConnectWithoutExecutionsInput>;
export const TaskItemCreateOrConnectWithoutExecutionsInputObjectZodSchema = makeSchema();
