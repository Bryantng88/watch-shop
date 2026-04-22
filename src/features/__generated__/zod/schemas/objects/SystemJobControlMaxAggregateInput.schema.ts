import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.literal(true).optional(),
  label: z.literal(true).optional(),
  enabled: z.literal(true).optional(),
  batchSize: z.literal(true).optional(),
  pausedReason: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  updatedBy: z.literal(true).optional()
}).strict();
export const SystemJobControlMaxAggregateInputObjectSchema: z.ZodType<Prisma.SystemJobControlMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlMaxAggregateInputType>;
export const SystemJobControlMaxAggregateInputObjectZodSchema = makeSchema();
