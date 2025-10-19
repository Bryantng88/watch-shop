import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantUpdateWithoutInvoiceItemInputObjectSchema as ProductVariantUpdateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUpdateWithoutInvoiceItemInput.schema';
import { ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema as ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutInvoiceItemInput.schema';
import { ProductVariantCreateWithoutInvoiceItemInputObjectSchema as ProductVariantCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantCreateWithoutInvoiceItemInput.schema';
import { ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutInvoiceItemInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductVariantUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema)]),
  where: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantUpsertWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductVariantUpsertWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpsertWithoutInvoiceItemInput>;
export const ProductVariantUpsertWithoutInvoiceItemInputObjectZodSchema = makeSchema();
