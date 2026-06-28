import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WorkflowEventLogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WorkflowEventLogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowEventLogUncheckedCreateInput>;
export const WorkflowEventLogUncheckedCreateInputObjectZodSchema = makeSchema();
