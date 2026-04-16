import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema';
import { InvoiceUpdateWithoutInvoiceItemInputObjectSchema as InvoiceUpdateWithoutInvoiceItemInputObjectSchema } from './InvoiceUpdateWithoutInvoiceItemInput.schema';
import { InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema as InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema } from './InvoiceUncheckedUpdateWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutInvoiceItemInputObjectSchema)])
}).strict();
export const InvoiceUpdateToOneWithWhereWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateToOneWithWhereWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateToOneWithWhereWithoutInvoiceItemInput>;
export const InvoiceUpdateToOneWithWhereWithoutInvoiceItemInputObjectZodSchema = makeSchema();
