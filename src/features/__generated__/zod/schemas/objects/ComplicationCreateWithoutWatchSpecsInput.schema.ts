import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const ComplicationCreateWithoutWatchSpecsInputObjectSchema: z.ZodType<Prisma.ComplicationCreateWithoutWatchSpecsInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCreateWithoutWatchSpecsInput>;
export const ComplicationCreateWithoutWatchSpecsInputObjectZodSchema = makeSchema();
