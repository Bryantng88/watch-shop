import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCreateWithoutRepliesInputObjectSchema as TaskItemActivityCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateWithoutRepliesInput.schema';
import { TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema as TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutRepliesInput.schema';
import { TaskItemActivityCreateOrConnectWithoutRepliesInputObjectSchema as TaskItemActivityCreateOrConnectWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateOrConnectWithoutRepliesInput.schema';
import { TaskItemActivityWhereUniqueInputObjectSchema as TaskItemActivityWhereUniqueInputObjectSchema } from './TaskItemActivityWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TaskItemActivityCreateOrConnectWithoutRepliesInputObjectSchema).optional(),
  connect: z.lazy(() => TaskItemActivityWhereUniqueInputObjectSchema).optional()
}).strict();
export const TaskItemActivityCreateNestedOneWithoutRepliesInputObjectSchema: z.ZodType<Prisma.TaskItemActivityCreateNestedOneWithoutRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityCreateNestedOneWithoutRepliesInput>;
export const TaskItemActivityCreateNestedOneWithoutRepliesInputObjectZodSchema = makeSchema();
