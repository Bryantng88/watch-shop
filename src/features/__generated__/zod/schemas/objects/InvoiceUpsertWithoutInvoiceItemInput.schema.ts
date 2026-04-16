import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceUpdateWithoutInvoiceItemInputObjectSchema as InvoiceUpdateWithoutInvoiceItemInputObjectSchema } from './InvoiceUpdateWithoutInvoiceItemInput.schema';
import { InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema as InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './InvoiceUncheckedUpdateWithoutInvoiceItemInput.schema';
import { InvoiceCreateWithoutInvoiceItemInputObjectSchema as InvoiceCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceCreateWithoutInvoiceItemInput.schema';
import { InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema as InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceUncheckedCreateWithoutInvoiceItemInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => InvoiceUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema)]),
  where: z.lazy(() => InvoiceWhereInputObjectSchema).optional()
}).strict();
export const InvoiceUpsertWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithoutInvoiceItemInput>;
export const InvoiceUpsertWithoutInvoiceItemInputObjectZodSchema = makeSchema();
