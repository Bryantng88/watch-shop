import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantCreateWithoutInvoiceItemInputObjectSchema as ProductVariantCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantCreateWithoutInvoiceItemInput.schema';
import { ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUncheckedCreateWithoutInvoiceItemInput.schema';
import { ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectSchema as ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectSchema } from './ProductVariantCreateOrConnectWithoutInvoiceItemInput.schema';
import { ProductVariantUpsertWithoutInvoiceItemInputObjectSchema as ProductVariantUpsertWithoutInvoiceItemInputObjectSchema } from './ProductVariantUpsertWithoutInvoiceItemInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './ProductVariantWhereUniqueInput.schema';
import { ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema as ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema } from './ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInput.schema';
import { ProductVariantUpdateWithoutInvoiceItemInputObjectSchema as ProductVariantUpdateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUpdateWithoutInvoiceItemInput.schema';
import { ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema as ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './ProductVariantUncheckedUpdateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductVariantCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedCreateWithoutInvoiceItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductVariantCreateOrConnectWithoutInvoiceItemInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductVariantUpsertWithoutInvoiceItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductVariantWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductVariantUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductVariantUncheckedUpdateWithoutInvoiceItemInputObjectSchema)]).optional()
}).strict();
export const ProductVariantUpdateOneWithoutInvoiceItemNestedInputObjectSchema: z.ZodType<Prisma.ProductVariantUpdateOneWithoutInvoiceItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantUpdateOneWithoutInvoiceItemNestedInput>;
export const ProductVariantUpdateOneWithoutInvoiceItemNestedInputObjectZodSchema = makeSchema();
