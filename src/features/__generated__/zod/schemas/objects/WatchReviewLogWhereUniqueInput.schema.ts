import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const WatchReviewLogWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchReviewLogWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchReviewLogWhereUniqueInput>;
export const WatchReviewLogWhereUniqueInputObjectZodSchema = makeSchema();
