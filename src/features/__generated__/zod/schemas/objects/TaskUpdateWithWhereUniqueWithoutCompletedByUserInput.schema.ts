import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutCompletedByUserInputObjectSchema as TaskUpdateWithoutCompletedByUserInputObjectSchema } from './TaskUpdateWithoutCompletedByUserInput.schema';
import { TaskUncheckedUpdateWithoutCompletedByUserInputObjectSchema as TaskUncheckedUpdateWithoutCompletedByUserInputObjectSchema } from './TaskUncheckedUpdateWithoutCompletedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutCompletedByUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutCompletedByUserInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutCompletedByUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutCompletedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutCompletedByUserInput>;
export const TaskUpdateWithWhereUniqueWithoutCompletedByUserInputObjectZodSchema = makeSchema();
