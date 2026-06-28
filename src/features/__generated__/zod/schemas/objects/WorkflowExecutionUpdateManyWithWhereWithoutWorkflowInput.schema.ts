import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionScalarWhereInputObjectSchema as WorkflowExecutionScalarWhereInputObjectSchema } from './WorkflowExecutionScalarWhereInput.schema';
import { WorkflowExecutionUpdateManyMutationInputObjectSchema as WorkflowExecutionUpdateManyMutationInputObjectSchema } from './WorkflowExecutionUpdateManyMutationInput.schema';
import { WorkflowExecutionUncheckedUpdateManyWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedUpdateManyWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedUpdateManyWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowExecutionUpdateManyMutationInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedUpdateManyWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInput>;
export const WorkflowExecutionUpdateManyWithWhereWithoutWorkflowInputObjectZodSchema = makeSchema();
