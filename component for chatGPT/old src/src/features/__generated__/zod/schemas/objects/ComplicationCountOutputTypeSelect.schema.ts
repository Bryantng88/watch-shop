import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  watchSpecs: z.boolean().optional()
}).strict();
export const ComplicationCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ComplicationCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCountOutputTypeSelect>;
export const ComplicationCountOutputTypeSelectObjectZodSchema = makeSchema();
