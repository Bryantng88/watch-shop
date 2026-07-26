import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { WorkflowExecutionEventUncheckedCreateNestedManyWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedCreateNestedManyWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateNestedManyWithoutBusinessEventLogInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  eventKey: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  actorUserId: z.string().optional().nullable(),
  metadataJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  workflowEvents: z.lazy(() => WorkflowExecutionEventUncheckedCreateNestedManyWithoutBusinessEventLogInputObjectSchema).optional()
}).strict();
export const BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectSchema: z.ZodType<Prisma.BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInput>;
export const BusinessEventLogUncheckedCreateWithoutProjectionDeliveriesInputObjectZodSchema = makeSchema();
