import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutInvoiceItemInputObjectSchema as ProductCreateWithoutInvoiceItemInputObjectSchema } from './ProductCreateWithoutInvoiceItemInput.schema';
import { ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema as ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './ProductUncheckedCreateWithoutInvoiceItemInput.schema';
import { ProductCreateOrConnectWithoutInvoiceItemInputObjectSchema as ProductCreateOrConnectWithoutInvoiceItemInputObjectSchema } from './ProductCreateOrConnectWithoutInvoiceItemInput.schema';
import { ProductUpsertWithoutInvoiceItemInputObjectSchema as ProductUpsertWithoutInvoiceItemInputObjectSchema } from './ProductUpsertWithoutInvoiceItemInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema as ProductUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutInvoiceItemInput.schema';
import { ProductUpdateWithoutInvoiceItemInputObjectSchema as ProductUpdateWithoutInvoiceItemInputObjectSchema } from './ProductUpdateWithoutInvoiceItemInput.schema';
import { ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema as ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './ProductUncheckedUpdateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutInvoiceItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutInvoiceItemInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutInvoiceItemInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutInvoiceItemInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneWithoutInvoiceItemNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneWithoutInvoiceItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneWithoutInvoiceItemNestedInput>;
export const ProductUpdateOneWithoutInvoiceItemNestedInputObjectZodSchema = makeSchema();
