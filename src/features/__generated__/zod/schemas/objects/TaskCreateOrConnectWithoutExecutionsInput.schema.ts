import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutExecutionsInputObjectSchema as TaskCreateWithoutExecutionsInputObjectSchema } from './TaskCreateWithoutExecutionsInput.schema';
import { TaskUncheckedCreateWithoutExecutionsInputObjectSchema as TaskUncheckedCreateWithoutExecutionsInputObjectSchema } from './TaskUncheckedCreateWithoutExecutionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutExecutionsInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutExecutionsInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutExecutionsInput>;
export const TaskCreateOrConnectWithoutExecutionsInputObjectZodSchema = makeSchema();
