import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionStatusSchema } from '../enums/WorkflowExecutionStatus.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { WorkflowTemplateCreateNestedOneWithoutExecutionsInputObjectSchema as WorkflowTemplateCreateNestedOneWithoutExecutionsInputObjectSchema } from './WorkflowTemplateCreateNestedOneWithoutExecutionsInput.schema';
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
  workflow: z.lazy(() => WorkflowTemplateCreateNestedOneWithoutExecutionsInputObjectSchema),
  events: z.lazy(() => WorkflowExecutionEventCreateNestedManyWithoutExecutionInputObjectSchema)
}).strict();
export const WorkflowExecutionCreateInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateInput>;
export const WorkflowExecutionCreateInputObjectZodSchema = makeSchema();
