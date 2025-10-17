import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutInvoiceItemInputObjectSchema as ProductCreateWithoutInvoiceItemInputObjectSchema } from './ProductCreateWithoutInvoiceItemInput.schema';
import { ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductUncheckedCreateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutInvoiceItemInput>;
export const ProductCreateOrConnectWithoutInvoiceItemInputObjectZodSchema = makeSchema();
