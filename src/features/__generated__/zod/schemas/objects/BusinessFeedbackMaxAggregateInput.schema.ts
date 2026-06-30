import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  eventKey: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  message: z.literal(true).optional(),
  visibility: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const BusinessFeedbackMaxAggregateInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BusinessFeedbackMaxAggregateInputType>;
export const BusinessFeedbackMaxAggregateInputObjectZodSchema = makeSchema();
