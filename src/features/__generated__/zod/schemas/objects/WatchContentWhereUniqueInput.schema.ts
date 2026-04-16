import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  watchId: z.string().optional()
}).strict();
export const WatchContentWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchContentWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentWhereUniqueInput>;
export const WatchContentWhereUniqueInputObjectZodSchema = makeSchema();
