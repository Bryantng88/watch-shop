import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutInvoiceItemInputObjectSchema as ProductUpdateWithoutInvoiceItemInputObjectSchema } from './ProductUpdateWithoutInvoiceItemInput.schema';
import { ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema as ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './ProductUncheckedUpdateWithoutInvoiceItemInput.schema';
import { ProductCreateWithoutInvoiceItemInputObjectSchema as ProductCreateWithoutInvoiceItemInputObjectSchema } from './ProductCreateWithoutInvoiceItemInput.schema';
import { ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductUncheckedCreateWithoutInvoiceItemInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutInvoiceItemInput>;
export const ProductUpsertWithoutInvoiceItemInputObjectZodSchema = makeSchema();
