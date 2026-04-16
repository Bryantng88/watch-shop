import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutInvoiceItemInputObjectSchema as InvoiceCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceCreateWithoutInvoiceItemInput.schema';
import { InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema as InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceUncheckedCreateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutInvoiceItemInput>;
export const InvoiceCreateOrConnectWithoutInvoiceItemInputObjectZodSchema = makeSchema();
