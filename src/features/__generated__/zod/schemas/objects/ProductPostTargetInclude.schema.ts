import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { PostTargetArgsObjectSchema as PostTargetArgsObjectSchema } from './PostTargetArgs.schema'

const makeSchema = () => z.object({
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  postTarget: z.union([z.boolean(), z.lazy(() => PostTargetArgsObjectSchema)]).optional()
}).strict();
export const ProductPostTargetIncludeObjectSchema: z.ZodType<Prisma.ProductPostTargetInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetInclude>;
export const ProductPostTargetIncludeObjectZodSchema = makeSchema();
