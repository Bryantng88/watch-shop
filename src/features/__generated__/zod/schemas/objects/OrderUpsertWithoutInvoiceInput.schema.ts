import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutInvoiceInputObjectSchema as OrderUpdateWithoutInvoiceInputObjectSchema } from './OrderUpdateWithoutInvoiceInput.schema';
import { OrderUncheckedUpdateWithoutInvoiceInputObjectSchema as OrderUncheckedUpdateWithoutInvoiceInputObjectSchema } from './OrderUncheckedUpdateWithoutInvoiceInput.schema';
import { OrderCreateWithoutInvoiceInputObjectSchema as OrderCreateWithoutInvoiceInputObjectSchema } from './OrderCreateWithoutInvoiceInput.schema';
import { OrderUncheckedCreateWithoutInvoiceInputObjectSchema as OrderUncheckedCreateWithoutInvoiceInputObjectSchema } from './OrderUncheckedCreateWithoutInvoiceInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutInvoiceInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutInvoiceInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutInvoiceInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutInvoiceInput>;
export const OrderUpsertWithoutInvoiceInputObjectZodSchema = makeSchema();
