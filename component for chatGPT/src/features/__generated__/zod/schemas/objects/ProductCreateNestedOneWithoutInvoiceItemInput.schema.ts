import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutInvoiceItemInputObjectSchema as ProductCreateWithoutInvoiceItemInputObjectSchema } from './ProductCreateWithoutInvoiceItemInput.schema';
import { ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductUncheckedCreateWithoutInvoiceItemInput.schema';
import { ProductCreateOrConnectWithoutInvoiceItemInputObjectSchema as ProductCreateOrConnectWithoutInvoiceItemInputObjectSchema } from './ProductCreateOrConnectWithoutInvoiceItemInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutInvoiceItemInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutInvoiceItemInput>;
export const ProductCreateNestedOneWithoutInvoiceItemInputObjectZodSchema = makeSchema();
