import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  key: z.literal(true).optional(),
  name: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  roleNames: z.literal(true).optional(),
  userIds: z.literal(true).optional(),
  zaloGroupId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const NotificationRecipientGroupCountAggregateInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupCountAggregateInputType>;
export const NotificationRecipientGroupCountAggregateInputObjectZodSchema = makeSchema();
