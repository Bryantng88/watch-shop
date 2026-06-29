import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  eventKey: z.string(),
  enabled: z.boolean().optional(),
  channel: z.string(),
  recipientGroupKey: z.string(),
  titleTemplate: z.string().optional().nullable(),
  messageTemplate: z.string(),
  priority: z.string().optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const NotificationRuleCreateInputObjectSchema: z.ZodType<Prisma.NotificationRuleCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRuleCreateInput>;
export const NotificationRuleCreateInputObjectZodSchema = makeSchema();
