import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  containerType: z.boolean().optional(),
  containerId: z.boolean().optional(),
  sourceType: z.boolean().optional(),
  sourceId: z.boolean().optional(),
  occurredAt: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  title: z.boolean().optional(),
  bodySnapshot: z.boolean().optional(),
  visibility: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const TimelineEntrySelectObjectSchema: z.ZodType<Prisma.TimelineEntrySelect> = makeSchema() as unknown as z.ZodType<Prisma.TimelineEntrySelect>;
export const TimelineEntrySelectObjectZodSchema = makeSchema();
