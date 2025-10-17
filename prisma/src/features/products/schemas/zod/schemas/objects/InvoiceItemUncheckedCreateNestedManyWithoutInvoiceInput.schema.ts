import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutInvoiceInputObjectSchema as InvoiceItemCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemCreateWithoutInvoiceInput.schema';
import { InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema as InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutInvoiceInput.schema';
import { InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema as InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutInvoiceInput.schema';
import { InvoiceItemCreateManyInvoiceInputEnvelopeObjectSchema as InvoiceItemCreateManyInvoiceInputEnvelopeObjectSchema } from './InvoiceItemCreateManyInvoiceInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutInvoiceInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyInvoiceInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInput>;
export const InvoiceItemUncheckedCreateNestedManyWithoutInvoiceInputObjectZodSchema = makeSchema();
