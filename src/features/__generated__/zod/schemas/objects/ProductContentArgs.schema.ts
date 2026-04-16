import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentSelectObjectSchema as ProductContentSelectObjectSchema } from './ProductContentSelect.schema';
import { ProductContentIncludeObjectSchema as ProductContentIncludeObjectSchema } from './ProductContentInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProductContentSelectObjectSchema).optional(),
  include: z.lazy(() => ProductContentIncludeObjectSchema).optional()
}).strict();
export const ProductContentArgsObjectSchema = makeSchema();
export const ProductContentArgsObjectZodSchema = makeSchema();
