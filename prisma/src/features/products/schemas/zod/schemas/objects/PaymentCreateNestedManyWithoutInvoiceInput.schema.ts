import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutInvoiceInputObjectSchema as PaymentCreateWithoutInvoiceInputObjectSchema } from './PaymentCreateWithoutInvoiceInput.schema';
import { PaymentUncheckedCreateWithoutInvoiceInputObjectSchema as PaymentUncheckedCreateWithoutInvoiceInputObjectSchema } from './PaymentUncheckedCreateWithoutInvoiceInput.schema';
import { PaymentCreateOrConnectWithoutInvoiceInputObjectSchema as PaymentCreateOrConnectWithoutInvoiceInputObjectSchema } from './PaymentCreateOrConnectWithoutInvoiceInput.schema';
import { PaymentCreateManyInvoiceInputEnvelopeObjectSchema as PaymentCreateManyInvoiceInputEnvelopeObjectSchema } from './PaymentCreateManyInvoiceInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentCreateWithoutInvoiceInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutInvoiceInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutInvoiceInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyInvoiceInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PaymentCreateNestedManyWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.PaymentCreateNestedManyWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateNestedManyWithoutInvoiceInput>;
export const PaymentCreateNestedManyWithoutInvoiceInputObjectZodSchema = makeSchema();
