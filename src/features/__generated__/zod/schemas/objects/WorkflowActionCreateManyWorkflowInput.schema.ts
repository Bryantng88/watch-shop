import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  actionType: WorkflowActionTypeSchema,
  sortOrder: z.number().int().optional(),
  configJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WorkflowActionCreateManyWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowActionCreateManyWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionCreateManyWorkflowInput>;
export const WorkflowActionCreateManyWorkflowInputObjectZodSchema = makeSchema();
