import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionArgsObjectSchema as AcquisitionArgsObjectSchema } from './AcquisitionArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { OrderItemArgsObjectSchema as OrderItemArgsObjectSchema } from './OrderItemArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  acquisitionId: z.boolean().optional(),
  productId: z.boolean().optional(),
  variantId: z.boolean().optional(),
  quantity: z.boolean().optional(),
  unitCost: z.boolean().optional(),
  currency: z.boolean().optional(),
  notes: z.boolean().optional(),
  sourceOrderItemId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  sourceOrderItem: z.union([z.boolean(), z.lazy(() => OrderItemArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionItemSelectObjectSchema: z.ZodType<Prisma.AcquisitionItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemSelect>;
export const AcquisitionItemSelectObjectZodSchema = makeSchema();
