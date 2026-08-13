import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema as JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { EnumCarrierWebhookStatusWithAggregatesFilterObjectSchema as EnumCarrierWebhookStatusWithAggregatesFilterObjectSchema } from './EnumCarrierWebhookStatusWithAggregatesFilter.schema';
import { CarrierWebhookStatusSchema } from '../enums/CarrierWebhookStatus.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

const carrierwebhookdeliveryscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierWebhookDeliveryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierWebhookDeliveryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierWebhookDeliveryScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierWebhookDeliveryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierWebhookDeliveryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  carrierCode: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  environment: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  externalEventId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  externalOrderCode: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  payloadHash: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  payloadJson: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  signatureValid: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  status: z.union([z.lazy(() => EnumCarrierWebhookStatusWithAggregatesFilterObjectSchema), CarrierWebhookStatusSchema]).optional(),
  receivedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  processedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  errorMessage: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const CarrierWebhookDeliveryScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryScalarWhereWithAggregatesInput> = carrierwebhookdeliveryscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryScalarWhereWithAggregatesInput>;
export const CarrierWebhookDeliveryScalarWhereWithAggregatesInputObjectZodSchema = carrierwebhookdeliveryscalarwherewithaggregatesinputSchema;
