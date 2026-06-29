import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  dispatchId: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  recipientGroupKey: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  errorMessage: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sentAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationChannelDeliveryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.NotificationChannelDeliveryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationChannelDeliveryOrderByWithRelationInput>;
export const NotificationChannelDeliveryOrderByWithRelationInputObjectZodSchema = makeSchema();
