import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventCreateManyBusinessEventLogInputObjectSchema as WorkflowExecutionEventCreateManyBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventCreateManyBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkflowExecutionEventCreateManyBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateManyBusinessEventLogInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelope>;
export const WorkflowExecutionEventCreateManyBusinessEventLogInputEnvelopeObjectZodSchema = makeSchema();
