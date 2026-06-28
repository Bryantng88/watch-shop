import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionCreateManyWorkflowInputObjectSchema as WorkflowConditionCreateManyWorkflowInputObjectSchema } from './WorkflowConditionCreateManyWorkflowInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkflowConditionCreateManyWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionCreateManyWorkflowInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkflowConditionCreateManyWorkflowInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkflowConditionCreateManyWorkflowInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionCreateManyWorkflowInputEnvelope>;
export const WorkflowConditionCreateManyWorkflowInputEnvelopeObjectZodSchema = makeSchema();
