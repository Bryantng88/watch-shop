import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectSchema as AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectSchema } from './AcquisitionCreateNestedOneWithoutAcquisitionItemInput.schema';
import { ProductCreateNestedOneWithoutAcquisitionItemInputObjectSchema as ProductCreateNestedOneWithoutAcquisitionItemInputObjectSchema } from './ProductCreateNestedOneWithoutAcquisitionItemInput.schema';
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
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutAcquisitionItemInputObjectSchema).optional()
}).strict();
export const AcquisitionItemCreateWithoutSourceOrderItemInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateWithoutSourceOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateWithoutSourceOrderItemInput>;
export const AcquisitionItemCreateWithoutSourceOrderItemInputObjectZodSchema = makeSchema();
