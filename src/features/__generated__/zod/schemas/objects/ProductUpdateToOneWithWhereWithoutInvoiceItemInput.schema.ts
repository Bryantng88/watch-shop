import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutInvoiceItemInputObjectSchema as ProductUpdateWithoutInvoiceItemInputObjectSchema } from './ProductUpdateWithoutInvoiceItemInput.schema';
import { ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema as ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './ProductUncheckedUpdateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutInvoiceItemInput>;
export const ProductUpdateToOneWithWhereWithoutInvoiceItemInputObjectZodSchema = makeSchema();
