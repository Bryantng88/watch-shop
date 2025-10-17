import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const PartVariantSpecIncludeObjectSchema: z.ZodType<Prisma.PartVariantSpecInclude> = makeSchema() as unknown as z.ZodType<Prisma.PartVariantSpecInclude>;
export const PartVariantSpecIncludeObjectZodSchema = makeSchema();
