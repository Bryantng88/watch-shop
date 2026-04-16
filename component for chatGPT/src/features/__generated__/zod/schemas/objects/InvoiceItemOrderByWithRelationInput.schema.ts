import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { InvoiceOrderByWithRelationInputObjectSchema as InvoiceOrderByWithRelationInputObjectSchema } from './InvoiceOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './ProductVariantOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  invoiceId: SortOrderSchema.optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  variantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  title: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  quantity: SortOrderSchema.optional(),
  unitPrice: SortOrderSchema.optional(),
  discount: SortOrderSchema.optional(),
  taxRate: SortOrderSchema.optional(),
  lineTotal: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  invoice: z.lazy(() => InvoiceOrderByWithRelationInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const InvoiceItemOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.InvoiceItemOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemOrderByWithRelationInput>;
export const InvoiceItemOrderByWithRelationInputObjectZodSchema = makeSchema();
