import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutCancelledByUserInputObjectSchema as TaskUpdateWithoutCancelledByUserInputObjectSchema } from './TaskUpdateWithoutCancelledByUserInput.schema';
import { TaskUncheckedUpdateWithoutCancelledByUserInputObjectSchema as TaskUncheckedUpdateWithoutCancelledByUserInputObjectSchema } from './TaskUncheckedUpdateWithoutCancelledByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutCancelledByUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutCancelledByUserInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutCancelledByUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutCancelledByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutCancelledByUserInput>;
export const TaskUpdateWithWhereUniqueWithoutCancelledByUserInputObjectZodSchema = makeSchema();
