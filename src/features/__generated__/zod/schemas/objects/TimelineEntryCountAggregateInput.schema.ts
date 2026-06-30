import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  containerType: z.literal(true).optional(),
  containerId: z.literal(true).optional(),
  sourceType: z.literal(true).optional(),
  sourceId: z.literal(true).optional(),
  occurredAt: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  title: z.literal(true).optional(),
  bodySnapshot: z.literal(true).optional(),
  visibility: z.literal(true).optional(),
  metadataJson: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const TimelineEntryCountAggregateInputObjectSchema: z.ZodType<Prisma.TimelineEntryCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntryCountAggregateInputType>;
export const TimelineEntryCountAggregateInputObjectZodSchema = makeSchema();
