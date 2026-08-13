import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumCarrierWebhookStatusFilterObjectSchema as EnumCarrierWebhookStatusFilterObjectSchema } from './EnumCarrierWebhookStatusFilter.schema';
import { CarrierWebhookStatusSchema } from '../enums/CarrierWebhookStatus.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const carrierwebhookdeliverywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierWebhookDeliveryWhereInputObjectSchema), z.lazy(() => CarrierWebhookDeliveryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierWebhookDeliveryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierWebhookDeliveryWhereInputObjectSchema), z.lazy(() => CarrierWebhookDeliveryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  carrierCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  environment: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  externalEventId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  externalOrderCode: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  payloadHash: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  payloadJson: z.lazy(() => JsonFilterObjectSchema).optional(),
  signatureValid: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  status: z.union([z.lazy(() => EnumCarrierWebhookStatusFilterObjectSchema), CarrierWebhookStatusSchema]).optional(),
  receivedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  processedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  errorMessage: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const CarrierWebhookDeliveryWhereInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryWhereInput> = carrierwebhookdeliverywhereinputSchema as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryWhereInput>;
export const CarrierWebhookDeliveryWhereInputObjectZodSchema = carrierwebhookdeliverywhereinputSchema;
