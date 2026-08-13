import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierWebhookStatusSchema } from '../enums/CarrierWebhookStatus.schema'

const nestedenumcarrierwebhookstatusfilterSchema = z.object({
  equals: CarrierWebhookStatusSchema.optional(),
  in: CarrierWebhookStatusSchema.array().optional(),
  notIn: CarrierWebhookStatusSchema.array().optional(),
  not: z.union([CarrierWebhookStatusSchema, z.lazy(() => NestedEnumCarrierWebhookStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumCarrierWebhookStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumCarrierWebhookStatusFilter> = nestedenumcarrierwebhookstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumCarrierWebhookStatusFilter>;
export const NestedEnumCarrierWebhookStatusFilterObjectZodSchema = nestedenumcarrierwebhookstatusfilterSchema;
