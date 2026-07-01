import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyScalarWhereInputObjectSchema as TaskItemActivityReplyScalarWhereInputObjectSchema } from './TaskItemActivityReplyScalarWhereInput.schema';
import { TaskItemActivityReplyUpdateManyMutationInputObjectSchema as TaskItemActivityReplyUpdateManyMutationInputObjectSchema } from './TaskItemActivityReplyUpdateManyMutationInput.schema';
import { TaskItemActivityReplyUncheckedUpdateManyWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedUpdateManyWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedUpdateManyWithoutActivityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskItemActivityReplyUpdateManyMutationInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedUpdateManyWithoutActivityInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInput>;
export const TaskItemActivityReplyUpdateManyWithWhereWithoutActivityInputObjectZodSchema = makeSchema();
