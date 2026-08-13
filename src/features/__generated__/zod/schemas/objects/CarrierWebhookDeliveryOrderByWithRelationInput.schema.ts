import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  carrierCode: SortOrderSchema.optional(),
  environment: SortOrderSchema.optional(),
  externalEventId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  externalOrderCode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payloadHash: SortOrderSchema.optional(),
  payloadJson: SortOrderSchema.optional(),
  signatureValid: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  receivedAt: SortOrderSchema.optional(),
  processedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const CarrierWebhookDeliveryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CarrierWebhookDeliveryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierWebhookDeliveryOrderByWithRelationInput>;
export const CarrierWebhookDeliveryOrderByWithRelationInputObjectZodSchema = makeSchema();
