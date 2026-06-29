import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  key: z.literal(true).optional(),
  name: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  zaloGroupId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const NotificationRecipientGroupMinAggregateInputObjectSchema: z.ZodType<Prisma.NotificationRecipientGroupMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.NotificationRecipientGroupMinAggregateInputType>;
export const NotificationRecipientGroupMinAggregateInputObjectZodSchema = makeSchema();
