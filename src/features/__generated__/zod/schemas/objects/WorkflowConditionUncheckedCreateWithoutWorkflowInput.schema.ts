import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  eventKey: z.string(),
  targetType: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  configJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowConditionUncheckedCreateWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionUncheckedCreateWithoutWorkflowInput>;
export const WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectZodSchema = makeSchema();
