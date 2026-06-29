import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  businessEventLogId: z.boolean().optional(),
  ruleId: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  status: z.boolean().optional(),
  errorMessage: z.boolean().optional(),
  payloadJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const NotificationDispatchSelectObjectSchema: z.ZodType<Prisma.NotificationDispatchSelect> = makeSchema() as unknown as z.ZodType<Prisma.NotificationDispatchSelect>;
export const NotificationDispatchSelectObjectZodSchema = makeSchema();
