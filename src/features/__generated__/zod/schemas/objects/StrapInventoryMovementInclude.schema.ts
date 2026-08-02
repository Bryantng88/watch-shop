import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  strapVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const StrapInventoryMovementIncludeObjectSchema: z.ZodType<Prisma.StrapInventoryMovementInclude> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementInclude>;
export const StrapInventoryMovementIncludeObjectZodSchema = makeSchema();
