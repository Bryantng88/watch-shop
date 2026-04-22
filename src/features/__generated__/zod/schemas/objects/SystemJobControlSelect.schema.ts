import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  key: z.boolean().optional(),
  label: z.boolean().optional(),
  enabled: z.boolean().optional(),
  batchSize: z.boolean().optional(),
  pausedReason: z.boolean().optional(),
  metadata: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  updated_by: z.boolean().optional()
}).strict();
export const SystemJobControlSelectObjectSchema: z.ZodType<Prisma.SystemJobControlSelect> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlSelect>;
export const SystemJobControlSelectObjectZodSchema = makeSchema();
