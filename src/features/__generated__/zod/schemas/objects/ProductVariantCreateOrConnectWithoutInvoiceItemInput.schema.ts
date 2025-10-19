import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateWithoutInvoiceItemInputObjectSchema as ProductVariantCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantCreateWithoutInvoiceItemInput.schema';
import { ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductVariantCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema)])
}).strict();
export const ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateOrConnectWithoutInvoiceItemInput>;
export const ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectZodSchema = makeSchema();
