import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionScalarWhereInputObjectSchema as WorkflowConditionScalarWhereInputObjectSchema } from './WorkflowConditionScalarWhereInput.schema';
import { WorkflowConditionUpdateManyMutationInputObjectSchema as WorkflowConditionUpdateManyMutationInputObjectSchema } from './WorkflowConditionUpdateManyMutationInput.schema';
import { WorkflowConditionUncheckedUpdateManyWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedUpdateManyWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedUpdateManyWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowConditionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowConditionUpdateManyMutationInputObjectSchema), z.lazy(() => WorkflowConditionUncheckedUpdateManyWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowConditionUpdateManyWithWhereWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowConditionUpdateManyWithWhereWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionUpdateManyWithWhereWithoutWorkflowInput>;
export const WorkflowConditionUpdateManyWithWhereWithoutWorkflowInputObjectZodSchema = makeSchema();
