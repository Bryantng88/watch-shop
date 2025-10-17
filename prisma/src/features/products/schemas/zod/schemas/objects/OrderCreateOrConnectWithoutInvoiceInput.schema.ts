import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutInvoiceInputObjectSchema as OrderCreateWithoutInvoiceInputObjectSchema } from './OrderCreateWithoutInvoiceInput.schema';
import { OrderUncheckedCreateWithoutInvoiceInputObjectSchema as OrderUncheckedCreateWithoutInvoiceInputObjectSchema } from './OrderUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutInvoiceInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutInvoiceInput>;
export const OrderCreateOrConnectWithoutInvoiceInputObjectZodSchema = makeSchema();
