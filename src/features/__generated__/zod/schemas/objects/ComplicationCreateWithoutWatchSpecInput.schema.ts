import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const ComplicationCreateWithoutWatchSpecInputObjectSchema: z.ZodType<Prisma.ComplicationCreateWithoutWatchSpecInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCreateWithoutWatchSpecInput>;
export const ComplicationCreateWithoutWatchSpecInputObjectZodSchema = makeSchema();
