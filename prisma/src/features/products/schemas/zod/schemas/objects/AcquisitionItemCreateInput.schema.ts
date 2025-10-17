import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateNestedOneWithoutAcquisitionItemInput.schema';
import { ProductCreateNestedOneWithoutAcquisitionItemInputObjectSchema as ProductCreateNestedOneWithoutAcquisitionItemInputObjectSchema } from './ProductCreateNestedOneWithoutAcquisitionItemInput.schema';
import { OrderItemCreateNestedOneWithoutAcquisitionItemInputObjectSchema as OrderItemCreateNestedOneWithoutAcquisitionItemInputObjectSchema } from './OrderItemCreateNestedOneWithoutAcquisitionItemInput.schema';
import { ProductVariantCreateNestedOneWithoutAcquisitionItemInputObjectSchema as ProductVariantCreateNestedOneWithoutAcquisitionItemInputObjectSchema } from './ProductVariantCreateNestedOneWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  quantity: z.number().int().optional(),
  unitCost: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  acquisition: z.lazy(() => AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutAcquisitionItemInputObjectSchema).optional(),
  sourceOrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutAcquisitionItemInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutAcquisitionItemInputObjectSchema).optional()
}).strict();
export const AcquisitionItemCreateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateInput>;
export const AcquisitionItemCreateInputObjectZodSchema = makeSchema();
