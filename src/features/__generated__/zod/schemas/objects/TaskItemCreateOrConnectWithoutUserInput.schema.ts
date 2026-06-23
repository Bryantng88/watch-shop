import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereUniqueInputObjectSchema as TaskItemWhereUniqueInputObjectSchema } from './TaskItemWhereUniqueInput.schema';
import { TaskItemCreateWithoutUserInputObjectSchema as TaskItemCreateWithoutUserInputObjectSchema } from './TaskItemCreateWithoutUserInput.schema';
import { TaskItemUncheckedCreateWithoutUserInputObjectSchema as TaskItemUncheckedCreateWithoutUserInputObjectSchema } from './TaskItemUncheckedCreateWithoutUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemCreateWithoutUserInputObjectSchema), z.lazy(() => TaskItemUncheckedCreateWithoutUserInputObjectSchema)])
}).strict();
export const TaskItemCreateOrConnectWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskItemCreateOrConnectWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateOrConnectWithoutUserInput>;
export const TaskItemCreateOrConnectWithoutUserInputObjectZodSchema = makeSchema();
