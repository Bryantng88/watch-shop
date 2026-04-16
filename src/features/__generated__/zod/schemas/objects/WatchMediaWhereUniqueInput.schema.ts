import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  legacyProductImageId: z.string().optional()
}).strict();
export const WatchMediaWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchMediaWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaWhereUniqueInput>;
export const WatchMediaWhereUniqueInputObjectZodSchema = makeSchema();
