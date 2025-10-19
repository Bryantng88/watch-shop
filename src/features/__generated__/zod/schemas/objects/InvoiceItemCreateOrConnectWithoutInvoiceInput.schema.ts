import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemCreateWithoutInvoiceInputObjectSchema as InvoiceItemCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemCreateWithoutInvoiceInput.schema';
import { InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema as InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutInvoiceInput>;
export const InvoiceItemCreateOrConnectWithoutInvoiceInputObjectZodSchema = makeSchema();
