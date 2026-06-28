import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  workflowId: z.string(),
  actionType: WorkflowActionTypeSchema,
  sortOrder: z.number().int().optional(),
  configJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WorkflowActionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WorkflowActionUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionUncheckedCreateInput>;
export const WorkflowActionUncheckedCreateInputObjectZodSchema = makeSchema();
