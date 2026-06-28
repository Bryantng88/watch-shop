import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionTypeSchema } from '../enums/WorkflowActionType.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { WorkflowTemplateCreateNestedOneWithoutActionsInputObjectSchema as WorkflowTemplateCreateNestedOneWithoutActionsInputObjectSchema } from './WorkflowTemplateCreateNestedOneWithoutActionsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  actionType: WorkflowActionTypeSchema,
  sortOrder: z.number().int().optional(),
  configJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  workflow: z.lazy(() => WorkflowTemplateCreateNestedOneWithoutActionsInputObjectSchema)
}).strict();
export const WorkflowActionCreateInputObjectSchema: z.ZodType<Prisma.WorkflowActionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionCreateInput>;
export const WorkflowActionCreateInputObjectZodSchema = makeSchema();
