import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutWatchInputObjectSchema as TaskCreateWithoutWatchInputObjectSchema } from './TaskCreateWithoutWatchInput.schema';
import { TaskUncheckedCreateWithoutWatchInputObjectSchema as TaskUncheckedCreateWithoutWatchInputObjectSchema } from './TaskUncheckedCreateWithoutWatchInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutWatchInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutWatchInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutWatchInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutWatchInput>;
export const TaskCreateOrConnectWithoutWatchInputObjectZodSchema = makeSchema();
