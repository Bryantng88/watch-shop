import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  eventKey: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  message: z.boolean().optional(),
  visibility: z.boolean().optional(),
  metadataJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const BusinessFeedbackSelectObjectSchema: z.ZodType<Prisma.BusinessFeedbackSelect> = makeSchema() as unknown as z.ZodType<Prisma.BusinessFeedbackSelect>;
export const BusinessFeedbackSelectObjectZodSchema = makeSchema();
