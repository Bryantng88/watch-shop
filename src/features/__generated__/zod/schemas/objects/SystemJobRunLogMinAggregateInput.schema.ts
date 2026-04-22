import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  processorKey: z.literal(true).optional(),
  triggerSource: z.literal(true).optional(),
  status: z.literal(true).optional(),
  processedCount: z.literal(true).optional(),
  errorCount: z.literal(true).optional(),
  note: z.literal(true).optional(),
  startedAt: z.literal(true).optional(),
  finishedAt: z.literal(true).optional()
}).strict();
export const SystemJobRunLogMinAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogMinAggregateInputType>;
export const SystemJobRunLogMinAggregateInputObjectZodSchema = makeSchema();
