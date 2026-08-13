import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierWebhookStatusSchema } from '../enums/CarrierWebhookStatus.schema';
import { NestedEnumCarrierWebhookStatusFilterObjectSchema as NestedEnumCarrierWebhookStatusFilterObjectSchema } from './NestedEnumCarrierWebhookStatusFilter.schema'

const makeSchema = () => z.object({
  equals: CarrierWebhookStatusSchema.optional(),
  in: CarrierWebhookStatusSchema.array().optional(),
  notIn: CarrierWebhookStatusSchema.array().optional(),
  not: z.union([CarrierWebhookStatusSchema, z.lazy(() => NestedEnumCarrierWebhookStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumCarrierWebhookStatusFilterObjectSchema: z.ZodType<Prisma.EnumCarrierWebhookStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierWebhookStatusFilter>;
export const EnumCarrierWebhookStatusFilterObjectZodSchema = makeSchema();
