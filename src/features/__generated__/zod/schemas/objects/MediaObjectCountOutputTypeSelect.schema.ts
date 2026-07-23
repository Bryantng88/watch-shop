import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  bindings: z.boolean().optional(),
  operations: z.boolean().optional()
}).strict();
export const MediaObjectCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.MediaObjectCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectCountOutputTypeSelect>;
export const MediaObjectCountOutputTypeSelectObjectZodSchema = makeSchema();
