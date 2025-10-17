import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentScalarWhereInputObjectSchema as PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema';
import { PaymentUpdateManyMutationInputObjectSchema as PaymentUpdateManyMutationInputObjectSchema } from './PaymentUpdateManyMutationInput.schema';
import { PaymentUncheckedUpdateManyWithoutInvoiceInputObjectSchema as PaymentUncheckedUpdateManyWithoutInvoiceInputObjectSchema } from './PaymentUncheckedUpdateManyWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateManyMutationInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateManyWithoutInvoiceInputObjectSchema)])
}).strict();
export const PaymentUpdateManyWithWhereWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutInvoiceInput>;
export const PaymentUpdateManyWithWhereWithoutInvoiceInputObjectZodSchema = makeSchema();
