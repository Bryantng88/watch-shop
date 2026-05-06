import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  WatchReviewLog: z.boolean().optional()
}).strict();
export const WatchReviewStateCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.WatchReviewStateCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewStateCountOutputTypeSelect>;
export const WatchReviewStateCountOutputTypeSelectObjectZodSchema = makeSchema();
