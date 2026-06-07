import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutCreatedByUserInputObjectSchema as TaskUncheckedUpdateManyWithoutCreatedByUserInputObjectSchema } from './TaskUncheckedUpdateManyWithoutCreatedByUserInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutCreatedByUserInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutCreatedByUserInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutCreatedByUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutCreatedByUserInput>;
export const TaskUpdateManyWithWhereWithoutCreatedByUserInputObjectZodSchema = makeSchema();
