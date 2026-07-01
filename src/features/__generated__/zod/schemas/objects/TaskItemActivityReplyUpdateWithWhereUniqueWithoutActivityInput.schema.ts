import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyUpdateWithoutActivityInputObjectSchema as TaskItemActivityReplyUpdateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUpdateWithoutActivityInput.schema';
import { TaskItemActivityReplyUncheckedUpdateWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedUpdateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedUpdateWithoutActivityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityReplyUpdateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedUpdateWithoutActivityInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInput>;
export const TaskItemActivityReplyUpdateWithWhereUniqueWithoutActivityInputObjectZodSchema = makeSchema();
