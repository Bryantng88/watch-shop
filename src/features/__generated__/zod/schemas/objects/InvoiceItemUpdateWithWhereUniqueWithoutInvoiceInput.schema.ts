import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutInvoiceInputObjectSchema as InvoiceItemUpdateWithoutInvoiceInputObjectSchema } from './InvoiceItemUpdateWithoutInvoiceInput.schema';
import { InvoiceItemUncheckedUpdateWithoutInvoiceInputObjectSchema as InvoiceItemUncheckedUpdateWithoutInvoiceInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutInvoiceInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput>;
export const InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInputObjectZodSchema = makeSchema();
