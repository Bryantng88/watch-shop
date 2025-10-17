import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  productId: z.string().optional()
}).strict();
export const WatchSpecWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchSpecWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecWhereUniqueInput>;
export const WatchSpecWhereUniqueInputObjectZodSchema = makeSchema();
