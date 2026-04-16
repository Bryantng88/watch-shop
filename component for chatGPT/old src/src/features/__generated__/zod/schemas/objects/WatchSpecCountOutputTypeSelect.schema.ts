import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  complication: z.boolean().optional(),
  marketSegment: z.boolean().optional()
}).strict();
export const WatchSpecCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.WatchSpecCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecCountOutputTypeSelect>;
export const WatchSpecCountOutputTypeSelectObjectZodSchema = makeSchema();
