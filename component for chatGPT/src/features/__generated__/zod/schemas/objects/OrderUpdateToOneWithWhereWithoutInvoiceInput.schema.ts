import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutInvoiceInputObjectSchema as OrderUpdateWithoutInvoiceInputObjectSchema } from './OrderUpdateWithoutInvoiceInput.schema';
import { OrderUncheckedUpdateWithoutInvoiceInputObjectSchema as OrderUncheckedUpdateWithoutInvoiceInputObjectSchema } from './OrderUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutInvoiceInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutInvoiceInput>;
export const OrderUpdateToOneWithWhereWithoutInvoiceInputObjectZodSchema = makeSchema();
