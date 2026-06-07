import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereUniqueInputObjectSchema as TaskWhereUniqueInputObjectSchema } from './TaskWhereUniqueInput.schema';
import { TaskUpdateWithoutCreatedByUserInputObjectSchema as TaskUpdateWithoutCreatedByUserInputObjectSchema } from './TaskUpdateWithoutCreatedByUserInput.schema';
import { TaskUncheckedUpdateWithoutCreatedByUserInputObjectSchema as TaskUncheckedUpdateWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedUpdateWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutCreatedByUserInputObjectSchema), z.lazy(() => TaskUncheckedUpdateWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskUpdateWithWhereUniqueWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutCreatedByUserInput>;
export const TaskUpdateWithWhereUniqueWithoutCreatedByUserInputObjectZodSchema = makeSchema();
