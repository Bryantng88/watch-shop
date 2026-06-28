import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionCreateManyWorkflowInputObjectSchema as WorkflowActionCreateManyWorkflowInputObjectSchema } from './WorkflowActionCreateManyWorkflowInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkflowActionCreateManyWorkflowInputObjectSchema), z.lazy(() => WorkflowActionCreateManyWorkflowInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkflowActionCreateManyWorkflowInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkflowActionCreateManyWorkflowInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionCreateManyWorkflowInputEnvelope>;
export const WorkflowActionCreateManyWorkflowInputEnvelopeObjectZodSchema = makeSchema();
