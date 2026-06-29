import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  key: z.boolean().optional(),
  name: z.boolean().optional(),
  enabled: z.boolean().optional(),
  roleNames: z.boolean().optional(),
  userIds: z.boolean().optional(),
  zaloGroupId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const NotificationRecipientGroupSelectObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupSelect> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupSelect>;
export const NotificationRecipientGroupSelectObjectZodSchema = makeSchema();
