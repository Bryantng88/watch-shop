import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  channel: SortOrderSchema.optional(),
  recipientGroupKey: SortOrderSchema.optional(),
  titleTemplate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  messageTemplate: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const NotificationRuleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.NotificationRuleOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleOrderByWithRelationInput>;
export const NotificationRuleOrderByWithRelationInputObjectZodSchema = makeSchema();
