import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  set: z.string().array().optional(),
  push: z.union([z.string(), z.string().array()]).optional()
}).strict();
export const ProductContentUpdatehashtagsInputObjectSchema: z.ZodType<Prisma.ProductContentUpdatehashtagsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUpdatehashtagsInput>;
export const ProductContentUpdatehashtagsInputObjectZodSchema = makeSchema();
