import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionScalarWhereInputObjectSchema as WorkflowActionScalarWhereInputObjectSchema } from './WorkflowActionScalarWhereInput.schema';
import { WorkflowActionUpdateManyMutationInputObjectSchema as WorkflowActionUpdateManyMutationInputObjectSchema } from './WorkflowActionUpdateManyMutationInput.schema';
import { WorkflowActionUncheckedUpdateManyWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedUpdateManyWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedUpdateManyWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowActionScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowActionUpdateManyMutationInputObjectSchema), z.lazy(() => WorkflowActionUncheckedUpdateManyWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowActionUpdateManyWithWhereWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowActionUpdateManyWithWhereWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionUpdateManyWithWhereWithoutWorkflowInput>;
export const WorkflowActionUpdateManyWithWhereWithoutWorkflowInputObjectZodSchema = makeSchema();
