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
export const NotificationChannelDeliveryUncheckedCreateInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryUncheckedCreateInput>;
export const NotificationChannelDeliveryUncheckedCreateInputObjectZodSchema = makeSchema();
