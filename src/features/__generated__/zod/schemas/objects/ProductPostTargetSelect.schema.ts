import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { PostTargetArgsObjectSchema as PostTargetArgsObjectSchema } from './PostTargetArgs.schema'

const makeSchema = () => z.object({
  productId: z.boolean().optional(),
  postTargetId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  postTarget: z.union([z.boolean(), z.lazy(() => PostTargetArgsObjectSchema)]).optional()
}).strict();
export const ProductPostTargetSelectObjectSchema: z.ZodType<Prisma.ProductPostTargetSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductPostTargetSelect>;
export const ProductPostTargetSelectObjectZodSchema = makeSchema();
