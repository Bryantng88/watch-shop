import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  watchMedia: z.boolean().optional()
}).strict();
export const WatchCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.WatchCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchCountOutputTypeSelect>;
export const WatchCountOutputTypeSelectObjectZodSchema = makeSchema();
