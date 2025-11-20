import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemKindSchema } from '../enums/AcquisitionItemKind.schema';
import { AcquisitionItemStatusSchema } from '../enums/AcquisitionItemStatus.schema';
import { ProductTypeSchema } from '../enums/ProductType.schema';
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
  kind: AcquisitionItemKindSchema.optional().nullable(),
  status: AcquisitionItemStatusSchema.optional().nullable(),
  description: z.string().optional().nullable(),
  expectedReturnAt: z.coerce.date().optional().nullable(),
  returnedAt: z.coerce.date().optional().nullable(),
  vendorRmaNo: z.string().optional().nullable(),
  warrantyMonths: z.number().int().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  capitalizeToProduct: z.boolean().optional().nullable(),
  productType: ProductTypeSchema.optional(),
  acquisition: z.lazy(() => AcquisitionCreateNestedOneWithoutAcquisitionItemInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutAcquisitionItemInputObjectSchema).optional(),
  sourceOrderItem: z.lazy(() => OrderItemCreateNestedOneWithoutAcquisitionItemInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutAcquisitionItemInputObjectSchema).optional()
}).strict();
export const AcquisitionItemCreateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCreateInput>;
export const AcquisitionItemCreateInputObjectZodSchema = makeSchema();
