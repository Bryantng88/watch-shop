import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema';
import { TaskItemActivityCreateWithoutRepliesInputObjectSchema as TaskItemActivityCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateWithoutRepliesInput.schema';
import { TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema as TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutRepliesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema)])
}).strict();
export const TaskItemActivityCreateOrConnectWithoutRepliesInputObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateOrConnectWithoutRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateOrConnectWithoutRepliesInput>;
export const TaskItemActivityCreateOrConnectWithoutRepliesInputObjectZodSchema = makeSchema();
