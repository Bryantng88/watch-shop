import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.literal(true).optional(),
  label: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  batchSize: z.literal(true).optional(),
  pausedReason: z.literal(true).optional(),
  metadata: z.literal(true).optional(),
  updated_at: z.literal(true).optional(),
  updated_by: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const SystemJobControlCountAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlCountAggregateInputType>;
export const SystemJobControlCountAggregateInputObjectZodSchema = makeSchema();
