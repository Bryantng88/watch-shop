import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutInvoiceInputObjectSchema as PaymentUpdateWithoutInvoiceInputObjectSchema } from './PaymentUpdateWithoutInvoiceInput.schema';
import { PaymentUncheckedUpdateWithoutInvoiceInputObjectSchema as PaymentUncheckedUpdateWithoutInvoiceInputObjectSchema } from './PaymentUncheckedUpdateWithoutInvoiceInput.schema';
import { PaymentCreateWithoutInvoiceInputObjectSchema as PaymentCreateWithoutInvoiceInputObjectSchema } from './PaymentCreateWithoutInvoiceInput.schema';
import { PaymentUncheckedCreateWithoutInvoiceInputObjectSchema as PaymentUncheckedCreateWithoutInvoiceInputObjectSchema } from './PaymentUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PaymentUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutInvoiceInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const PaymentUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutInvoiceInput>;
export const PaymentUpsertWithWhereUniqueWithoutInvoiceInputObjectZodSchema = makeSchema();
