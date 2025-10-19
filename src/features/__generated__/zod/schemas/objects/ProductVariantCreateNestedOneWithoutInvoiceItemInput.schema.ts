import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutInvoiceItemInputObjectSchema as ProductVariantCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantCreateWithoutInvoiceItemInput.schema';
import { ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutInvoiceItemInput.schema';
import { ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectSchema as ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectSchema } from './ProductVariantCreateOrConnectWithoutInvoiceItemInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectSchema).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductVariantCreateNestedOneWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantCreateNestedOneWithoutInvoiceItemInput>;
export const ProductVariantCreateNestedOneWithoutInvoiceItemInputObjectZodSchema = makeSchema();
