import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutInvoiceInputObjectSchema as PaymentCreateWithoutInvoiceInputObjectSchema } from './PaymentCreateWithoutInvoiceInput.schema';
import { PaymentUncheckedCreateWithoutInvoiceInputObjectSchema as PaymentUncheckedCreateWithoutInvoiceInputObjectSchema } from './PaymentUncheckedCreateWithoutInvoiceInput.schema';
import { PaymentCreateOrConnectWithoutInvoiceInputObjectSchema as PaymentCreateOrConnectWithoutInvoiceInputObjectSchema } from './PaymentCreateOrConnectWithoutInvoiceInput.schema';
import { PaymentUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema as PaymentUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema } from './PaymentUpsertWithWhereUniqueWithoutInvoiceInput.schema';
import { PaymentCreateManyInvoiceInputEnvelopeObjectSchema as PaymentCreateManyInvoiceInputEnvelopeObjectSchema } from './PaymentCreateManyInvoiceInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema as PaymentUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema } from './PaymentUpdateWithWhereUniqueWithoutInvoiceInput.schema';
import { PaymentUpdateManyWithWhereWithoutInvoiceInputObjectSchema as PaymentUpdateManyWithWhereWithoutInvoiceInputObjectSchema } from './PaymentUpdateManyWithWhereWithoutInvoiceInput.schema';
import { PaymentScalarWhereInputObjectSchema as PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentCreateWithoutInvoiceInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutInvoiceInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutInvoiceInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PaymentUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyInvoiceInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PaymentUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PaymentUpdateManyWithWhereWithoutInvoiceInputObjectSchema), z.lazy(() => PaymentUpdateManyWithWhereWithoutInvoiceInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PaymentUncheckedUpdateManyWithoutInvoiceNestedInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutInvoiceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutInvoiceNestedInput>;
export const PaymentUncheckedUpdateManyWithoutInvoiceNestedInputObjectZodSchema = makeSchema();
