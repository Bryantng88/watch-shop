import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './TaskItemActivityWhereInput.schema';
import { TaskItemActivityUpdateWithoutRepliesInputObjectSchema as TaskItemActivityUpdateWithoutRepliesInputObjectSchema } from './TaskItemActivityUpdateWithoutRepliesInput.schema';
import { TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema as TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema } from './TaskItemActivityUncheckedUpdateWithoutRepliesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TaskItemActivityUpdateWithoutRepliesInputObjectSchema), z.lazy(() => TaskItemActivityUncheckedUpdateWithoutRepliesInputObjectSchema)])
}).strict();
export const TaskItemActivityUpdateToOneWithWhereWithoutRepliesInputObjectSchema: z.ZodType<Prisma.TaskItemActivityUpdateToOneWithWhereWithoutRepliesInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityUpdateToOneWithWhereWithoutRepliesInput>;
export const TaskItemActivityUpdateToOneWithWhereWithoutRepliesInputObjectZodSchema = makeSchema();
