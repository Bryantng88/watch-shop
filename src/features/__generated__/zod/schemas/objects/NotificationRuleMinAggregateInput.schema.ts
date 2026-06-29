import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  eventKey: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  channel: z.literal(true).optional(),
  recipientGroupKey: z.literal(true).optional(),
  titleTemplate: z.literal(true).optional(),
  messageTemplate: z.literal(true).optional(),
  priority: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const NotificationRuleMinAggregateInputObjectSchema: z.ZodType<Prisma.NotificationRuleMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleMinAggregateInputType>;
export const NotificationRuleMinAggregateInputObjectZodSchema = makeSchema();
