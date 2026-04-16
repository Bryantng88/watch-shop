import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  legacyVariantId: z.string().optional()
}).strict();
export const WatchWhereUniqueInputObjectSchema: z.ZodType<Prisma.WatchWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchWhereUniqueInput>;
export const WatchWhereUniqueInputObjectZodSchema = makeSchema();
