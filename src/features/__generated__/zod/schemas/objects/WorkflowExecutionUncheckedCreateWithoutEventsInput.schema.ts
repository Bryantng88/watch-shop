import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  workflowId: z.string(),
  actionTargetType: z.string(),
  actionTargetId: z.string(),
  status: WorkflowExecutionStatusSchema.optional(),
  errorMessage: z.string().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  failedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUncheckedCreateWithoutEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUncheckedCreateWithoutEventsInput>;
export const WorkflowExecutionUncheckedCreateWithoutEventsInputObjectZodSchema = makeSchema();
