import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantUpdateWithoutInvoiceItemInputObjectSchema as ProductVariantUpdateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUpdateWithoutInvoiceItemInput.schema';
import { ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema as ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductVariantUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema)])
}).strict();
export const ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInput>;
export const ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInputObjectZodSchema = makeSchema();
