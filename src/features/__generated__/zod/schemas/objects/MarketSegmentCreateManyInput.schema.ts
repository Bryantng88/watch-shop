import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const MarketSegmentCreateManyInputObjectSchema: z.ZodType<Prisma.MarketSegmentCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.MarketSegmentCreateManyInput>;
export const MarketSegmentCreateManyInputObjectZodSchema = makeSchema();
