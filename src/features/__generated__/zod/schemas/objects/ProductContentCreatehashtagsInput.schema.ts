import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  set: z.string().array()
}).strict();
export const ProductContentCreatehashtagsInputObjectSchema: z.ZodType<Prisma.ProductContentCreatehashtagsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentCreatehashtagsInput>;
export const ProductContentCreatehashtagsInputObjectZodSchema = makeSchema();
