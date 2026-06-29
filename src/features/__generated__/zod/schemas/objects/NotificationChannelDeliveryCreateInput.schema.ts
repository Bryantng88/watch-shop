import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  dispatchId: z.string(),
  channel: z.string(),
  recipientGroupKey: z.string(),
  status: z.string().optional(),
  errorMessage: z.string().optional().nullable(),
  payloadJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  sentAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const NotificationChannelDeliveryCreateInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryCreateInput>;
export const NotificationChannelDeliveryCreateInputObjectZodSchema = makeSchema();
