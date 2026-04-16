import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const ProductContentCreatespecBulletsInputObjectSchema: z.ZodType<Prisma.ProductContentCreatespecBulletsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentCreatespecBulletsInput>;
export const ProductContentCreatespecBulletsInputObjectZodSchema = makeSchema();
