import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutInvoiceInputObjectSchema as PaymentUpdateWithoutInvoiceInputObjectSchema } from './PaymentUpdateWithoutInvoiceInput.schema';
import { PaymentUncheckedUpdateWithoutInvoiceInputObjectSchema as PaymentUncheckedUpdateWithoutInvoiceInputObjectSchema } from './PaymentUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutInvoiceInputObjectSchema)])
}).strict();
export const PaymentUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutInvoiceInput>;
export const PaymentUpdateWithWhereUniqueWithoutInvoiceInputObjectZodSchema = makeSchema();
