import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const ProductContentIncludeObjectSchema: z.ZodType<Prisma.ProductContentInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentInclude>;
export const ProductContentIncludeObjectZodSchema = makeSchema();
