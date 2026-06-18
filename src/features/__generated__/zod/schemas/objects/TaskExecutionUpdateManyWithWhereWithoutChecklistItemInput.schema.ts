import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionUncheckedUpdateManyWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedUpdateManyWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedUpdateManyWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateManyWithoutChecklistItemInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateManyWithWhereWithoutChecklistItemInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutChecklistItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutChecklistItemInput>;
export const TaskExecutionUpdateManyWithWhereWithoutChecklistItemInputObjectZodSchema = makeSchema();
