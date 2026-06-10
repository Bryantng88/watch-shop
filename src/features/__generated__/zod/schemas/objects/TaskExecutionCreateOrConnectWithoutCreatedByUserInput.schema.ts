import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionCreateWithoutCreatedByUserInput.schema';
import { TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedCreateWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskExecutionCreateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUncheckedCreateWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionCreateOrConnectWithoutCreatedByUserInput>;
export const TaskExecutionCreateOrConnectWithoutCreatedByUserInputObjectZodSchema = makeSchema();
