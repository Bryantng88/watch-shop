import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventScalarWhereInputObjectSchema as WorkflowExecutionEventScalarWhereInputObjectSchema } from './WorkflowExecutionEventScalarWhereInput.schema';
import { WorkflowExecutionEventUpdateManyMutationInputObjectSchema as WorkflowExecutionEventUpdateManyMutationInputObjectSchema } from './WorkflowExecutionEventUpdateManyMutationInput.schema';
import { WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionInputObjectSchema as WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowExecutionEventUpdateManyMutationInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedUpdateManyWithoutExecutionInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInput>;
export const WorkflowExecutionEventUpdateManyWithWhereWithoutExecutionInputObjectZodSchema = makeSchema();
