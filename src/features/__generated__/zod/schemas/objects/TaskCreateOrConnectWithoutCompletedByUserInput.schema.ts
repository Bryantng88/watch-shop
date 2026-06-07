import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskCreateWithoutCompletedByUserInputObjectSchema as TaskCreateWithoutCompletedByUserInputObjectSchema } from './TaskCreateWithoutCompletedByUserInput.schema';
import { TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema as TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedCreateWithoutCompletedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUncheckedCreateWithoutCompletedByUserInputObjectSchema)])
}).strict();
export const TaskCreateOrConnectWithoutCompletedByUserInputObjectSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutCompletedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskCreateOrConnectWithoutCompletedByUserInput>;
export const TaskCreateOrConnectWithoutCompletedByUserInputObjectZodSchema = makeSchema();
