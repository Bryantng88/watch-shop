import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  idempotencyKey: z.string(),
  businessEventLogId: z.string().optional().nullable(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional().nullable(),
  effect: z.string().optional(),
  revokeEventKey: z.string().optional().nullable(),
  targetAliasIds: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  eventInstanceId: z.string().optional().nullable(),
  payloadJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  status: z.string().optional(),
  attempts: z.number().int().optional(),
  nextAttemptAt: z.coerce.date().optional(),
  lockedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  lastError: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProjectionEventDeliveryCreateManyInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryCreateManyInput>;
export const ProjectionEventDeliveryCreateManyInputObjectZodSchema = makeSchema();
