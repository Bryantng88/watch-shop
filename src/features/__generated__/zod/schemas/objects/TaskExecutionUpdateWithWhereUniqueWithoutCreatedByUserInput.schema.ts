import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereUniqueInputObjectSchema as TaskExecutionWhereUniqueInputObjectSchema } from './TaskExecutionWhereUniqueInput.schema';
import { TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema as TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUpdateWithoutCreatedByUserInput.schema';
import { TaskExecutionUncheckedUpdateWithoutCreatedByUserInputObjectSchema as TaskExecutionUncheckedUpdateWithoutCreatedByUserInputObjectSchema } from './TaskExecutionUncheckedUpdateWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInput>;
export const TaskExecutionUpdateWithWhereUniqueWithoutCreatedByUserInputObjectZodSchema = makeSchema();
