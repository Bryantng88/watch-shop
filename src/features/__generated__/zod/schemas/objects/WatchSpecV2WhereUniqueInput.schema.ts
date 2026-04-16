import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  watchId: z.string().optional()
}).strict();
export const WatchSpecV2WhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchSpecV2WhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2WhereUniqueInput>;
export const WatchSpecV2WhereUniqueInputObjectZodSchema = makeSchema();
