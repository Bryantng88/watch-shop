import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplyWhereUniqueInputObjectSchema as TaskItemActivityReplyWhereUniqueInputObjectSchema } from './TaskItemActivityReplyWhereUniqueInput.schema';
import { TaskItemActivityReplyCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyCreateWithoutActivityInput.schema';
import { TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema as TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema } from './TaskItemActivityReplyUncheckedCreateWithoutActivityInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskItemActivityReplyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskItemActivityReplyCreateWithoutActivityInputObjectSchema), z.lazy(() => TaskItemActivityReplyUncheckedCreateWithoutActivityInputObjectSchema)])
}).strict();
export const TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyCreateOrConnectWithoutActivityInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityReplyCreateOrConnectWithoutActivityInput>;
export const TaskItemActivityReplyCreateOrConnectWithoutActivityInputObjectZodSchema = makeSchema();
