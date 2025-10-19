import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const StrapVariantSpecIncludeObjectSchema: z.ZodType<Prisma.StrapVariantSpecInclude> = makeSchema() as unknown as z.ZodType<Prisma.StrapVariantSpecInclude>;
export const StrapVariantSpecIncludeObjectZodSchema = makeSchema();
