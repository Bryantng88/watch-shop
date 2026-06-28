import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { WorkflowTemplateCreateNestedOneWithoutConditionsInputObjectSchema as WorkflowTemplateCreateNestedOneWithoutConditionsInputObjectSchema } from './WorkflowTemplateCreateNestedOneWithoutConditionsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  eventKey: z.string(),
  targetType: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  configJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  workflow: z.lazy(() => WorkflowTemplateCreateNestedOneWithoutConditionsInputObjectSchema)
}).strict();
export const WorkflowConditionCreateInputObjectSchema: z.ZodType<Prisma.WorkflowConditionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionCreateInput>;
export const WorkflowConditionCreateInputObjectZodSchema = makeSchema();
