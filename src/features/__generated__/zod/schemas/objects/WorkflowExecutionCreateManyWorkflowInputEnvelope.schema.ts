import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionCreateManyWorkflowInputObjectSchema as WorkflowExecutionCreateManyWorkflowInputObjectSchema } from './WorkflowExecutionCreateManyWorkflowInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkflowExecutionCreateManyWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionCreateManyWorkflowInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkflowExecutionCreateManyWorkflowInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateManyWorkflowInputEnvelope>;
export const WorkflowExecutionCreateManyWorkflowInputEnvelopeObjectZodSchema = makeSchema();
