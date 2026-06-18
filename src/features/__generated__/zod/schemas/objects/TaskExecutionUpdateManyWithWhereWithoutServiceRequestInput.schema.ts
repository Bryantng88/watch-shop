import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionScalarWhereInputObjectSchema as TaskExecutionScalarWhereInputObjectSchema } from './TaskExecutionScalarWhereInput.schema';
import { TaskExecutionUpdateManyMutationInputObjectSchema as TaskExecutionUpdateManyMutationInputObjectSchema } from './TaskExecutionUpdateManyMutationInput.schema';
import { TaskExecutionUncheckedUpdateManyWithoutServiceRequestInputObjectSchema as TaskExecutionUncheckedUpdateManyWithoutServiceRequestInputObjectSchema } from './TaskExecutionUncheckedUpdateManyWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskExecutionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskExecutionUpdateManyMutationInputObjectSchema), z.lazy(() => TaskExecutionUncheckedUpdateManyWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TaskExecutionUpdateManyWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionUpdateManyWithWhereWithoutServiceRequestInput>;
export const TaskExecutionUpdateManyWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
