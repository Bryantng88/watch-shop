import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional()
}).strict();
export const ComplicationWhereUniqueInputObjectSchema: z.ZodType<Prisma.ComplicationWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ComplicationWhereUniqueInput>;
export const ComplicationWhereUniqueInputObjectZodSchema = makeSchema();
