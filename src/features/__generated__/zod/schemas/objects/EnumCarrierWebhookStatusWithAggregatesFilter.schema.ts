import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierWebhookStatusSchema } from '../enums/CarrierWebhookStatus.schema';
import { NestedEnumCarrierWebhookStatusWithAggregatesFilterObjectSchema as NestedEnumCarrierWebhookStatusWithAggregatesFilterObjectSchema } from './NestedEnumCarrierWebhookStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumCarrierWebhookStatusFilterObjectSchema as NestedEnumCarrierWebhookStatusFilterObjectSchema } from './NestedEnumCarrierWebhookStatusFilter.schema'

const makeSchema = () => z.object({
  equals: CarrierWebhookStatusSchema.optional(),
  in: CarrierWebhookStatusSchema.array().optional(),
  notIn: CarrierWebhookStatusSchema.array().optional(),
  not: z.union([CarrierWebhookStatusSchema, z.lazy(() => NestedEnumCarrierWebhookStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCarrierWebhookStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCarrierWebhookStatusFilterObjectSchema).optional()
}).strict();
export const EnumCarrierWebhookStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumCarrierWebhookStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierWebhookStatusWithAggregatesFilter>;
export const EnumCarrierWebhookStatusWithAggregatesFilterObjectZodSchema = makeSchema();
