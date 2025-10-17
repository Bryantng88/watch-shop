import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutInvoiceInputObjectSchema as OrderCreateWithoutInvoiceInputObjectSchema } from './OrderCreateWithoutInvoiceInput.schema';
import { OrderUncheckedCreateWithoutInvoiceInputObjectSchema as OrderUncheckedCreateWithoutInvoiceInputObjectSchema } from './OrderUncheckedCreateWithoutInvoiceInput.schema';
import { OrderCreateOrConnectWithoutInvoiceInputObjectSchema as OrderCreateOrConnectWithoutInvoiceInputObjectSchema } from './OrderCreateOrConnectWithoutInvoiceInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutInvoiceInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutInvoiceInput>;
export const OrderCreateNestedOneWithoutInvoiceInputObjectZodSchema = makeSchema();
