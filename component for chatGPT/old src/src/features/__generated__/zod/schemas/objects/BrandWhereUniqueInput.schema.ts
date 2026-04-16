import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional()
}).strict();
export const BrandWhereUniqueInputObjectSchema: z.ZodType<Prisma.BrandWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandWhereUniqueInput>;
export const BrandWhereUniqueInputObjectZodSchema = makeSchema();
