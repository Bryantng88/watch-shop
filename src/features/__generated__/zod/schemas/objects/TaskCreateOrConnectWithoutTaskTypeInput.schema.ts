import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutTaskTypeInputObjectSchema as TaskCreateWithoutTaskTypeInputObjectSchema } from './TaskCreateWithoutTaskTypeInput.schema';
import { TaskUncheckedCreateWithoutTaskTypeInputObjectSchema as TaskUncheckedCreateWithoutTaskTypeInputObjectSchema } from './TaskUncheckedCreateWithoutTaskTypeInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutTaskTypeInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutTaskTypeInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutTaskTypeInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutTaskTypeInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutTaskTypeInput>;
export const TaskCreateOrConnectWithoutTaskTypeInputObjectZodSchema = makeSchema();
