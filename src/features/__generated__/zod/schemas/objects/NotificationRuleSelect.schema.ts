import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  enabled: z.boolean().optional(),
  channel: z.boolean().optional(),
  recipientGroupKey: z.boolean().optional(),
  conditionJson: z.boolean().optional(),
  titleTemplate: z.boolean().optional(),
  messageTemplate: z.boolean().optional(),
  priority: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const NotificationRuleSelectObjectSchema: z.ZodType<Prisma.NotificationRuleSelect> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleSelect>;
export const NotificationRuleSelectObjectZodSchema = makeSchema();
