import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const ComplicationCreateManyInputObjectSchema: z.ZodType<Prisma.ComplicationCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationCreateManyInput>;
export const ComplicationCreateManyInputObjectZodSchema = makeSchema();
