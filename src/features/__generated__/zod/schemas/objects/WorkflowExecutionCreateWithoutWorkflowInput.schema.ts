import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { WorkflowExecutionEventCreateNestedManyWithoutExecutionInputObjectSchema as WorkflowExecutionEventCreateNestedManyWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventCreateNestedManyWithoutExecutionInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  actionTargetType: z.string(),
  actionTargetId: z.string(),
  status: WorkflowExecutionStatusSchema.optional(),
  errorMessage: z.string().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  events: z.lazy(() => WorkflowExecutionEventCreateNestedManyWithoutExecutionInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionCreateWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionCreateWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateWithoutWorkflowInput>;
export const WorkflowExecutionCreateWithoutWorkflowInputObjectZodSchema = makeSchema();
