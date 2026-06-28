import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventCreateManyExecutionInputObjectSchema as WorkflowExecutionEventCreateManyExecutionInputObjectSchema } from './WorkflowExecutionEventCreateManyExecutionInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WorkflowExecutionEventCreateManyExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventCreateManyExecutionInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateManyExecutionInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateManyExecutionInputEnvelope>;
export const WorkflowExecutionEventCreateManyExecutionInputEnvelopeObjectZodSchema = makeSchema();
