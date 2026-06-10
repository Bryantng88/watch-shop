import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskScalarWhereInputObjectSchema as TaskScalarWhereInputObjectSchema } from './TaskScalarWhereInput.schema';
import { TaskUpdateManyMutationInputObjectSchema as TaskUpdateManyMutationInputObjectSchema } from './TaskUpdateManyMutationInput.schema';
import { TaskUncheckedUpdateManyWithoutWorkCaseInputObjectSchema as TaskUncheckedUpdateManyWithoutWorkCaseInputObjectSchema } from './TaskUncheckedUpdateManyWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputObjectSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutWorkCaseInputObjectSchema)])
}).strict();
export const TaskUpdateManyWithWhereWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutWorkCaseInput>;
export const TaskUpdateManyWithWhereWithoutWorkCaseInputObjectZodSchema = makeSchema();
