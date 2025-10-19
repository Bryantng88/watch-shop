import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionArgsObjectSchema as AcquisitionArgsObjectSchema } from './AcquisitionArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { OrderItemArgsObjectSchema as OrderItemArgsObjectSchema } from './OrderItemArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  sourceOrderItem: z.union([z.boolean(), z.lazy(() => OrderItemArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionItemIncludeObjectSchema: z.ZodType<Prisma.AcquisitionItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemInclude>;
export const AcquisitionItemIncludeObjectZodSchema = makeSchema();
