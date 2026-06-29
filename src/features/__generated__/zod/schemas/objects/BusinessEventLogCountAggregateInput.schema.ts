import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  eventKey: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  metadataJson: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const BusinessEventLogCountAggregateInputObjectSchema: z.ZodType<Prisma.BusinessEventLogCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogCountAggregateInputType>;
export const BusinessEventLogCountAggregateInputObjectZodSchema = makeSchema();
