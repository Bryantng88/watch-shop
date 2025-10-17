import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentCreateWithoutInvoiceInputObjectSchema as PaymentCreateWithoutInvoiceInputObjectSchema } from './PaymentCreateWithoutInvoiceInput.schema';
import { PaymentUncheckedCreateWithoutInvoiceInputObjectSchema as PaymentUncheckedCreateWithoutInvoiceInputObjectSchema } from './PaymentUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const PaymentCreateOrConnectWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateOrConnectWithoutInvoiceInput>;
export const PaymentCreateOrConnectWithoutInvoiceInputObjectZodSchema = makeSchema();
