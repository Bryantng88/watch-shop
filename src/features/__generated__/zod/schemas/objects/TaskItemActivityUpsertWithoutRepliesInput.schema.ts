import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityUpdateWithoutRepliesInputObjectSchema as TaskItemActivityUpdateWithoutRepliesInputObjectSchema } from './TaskItemActivityUpdateWithoutRepliesInput.schema';
import { TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema as TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema } from './TaskItemActivityUncheckedUpdateWithoutRepliesInput.schema';
import { TaskItemActivityCreateWithoutRepliesInputObjectSchema as TaskItemActivityCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityCreateWithoutRepliesInput.schema';
import { TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema as TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema } from './TaskItemActivityUncheckedCreateWithoutRepliesInput.schema';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './TaskItemActivityWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TaskItemActivityUpdateWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskItemActivityCreateWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedCreateWithoutRepliesInputObjectSchema)]),
  where: z.lazy(() => TaskItemActivityWhereInputObjectSchema).optional()
}).strict();
export const TaskItemActivityUpsertWithoutRepliesInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpsertWithoutRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpsertWithoutRepliesInput>;
export const TaskItemActivityUpsertWithoutRepliesInputObjectZodSchema = makeSchema();
