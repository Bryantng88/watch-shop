import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentCreatespecBulletsInputObjectSchema as ProductContentCreatespecBulletsInputObjectSchema } from './ProductContentCreatespecBulletsInput.schema';
import { ProductContentCreatehashtagsInputObjectSchema as ProductContentCreatehashtagsInputObjectSchema } from './ProductContentCreatehashtagsInput.schema'

const makeSchema = () => z.object({
  productId: z.string(),
  titleSnapshot: z.string().optional().nullable(),
  brandSnapshot: z.string().optional().nullable(),
  refSnapshot: z.string().optional().nullable(),
  sizeSnapshot: z.string().optional().nullable(),
  movementSnapshot: z.string().optional().nullable(),
  glassSnapshot: z.string().optional().nullable(),
  strapClaspSnapshot: z.string().optional().nullable(),
  modelSnapshot: z.string().optional().nullable(),
  yearSnapshot: z.string().optional().nullable(),
  generatedContent: z.string().optional().nullable(),
  promptNote: z.string().optional().nullable(),
  generatedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  specBullets: z.union([z.lazy(() => ProductContentCreatespecBulletsInputObjectSchema), z.string().array()]).optional(),
  hashtags: z.union([z.lazy(() => ProductContentCreatehashtagsInputObjectSchema), z.string().array()]).optional()
}).strict();
export const ProductContentUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ProductContentUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentUncheckedCreateInput>;
export const ProductContentUncheckedCreateInputObjectZodSchema = makeSchema();
