import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutInvoiceInputObjectSchema as InvoiceItemUpdateWithoutInvoiceInputObjectSchema } from './InvoiceItemUpdateWithoutInvoiceInput.schema';
import { InvoiceItemUncheckedUpdateWithoutInvoiceInputObjectSchema as InvoiceItemUncheckedUpdateWithoutInvoiceInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutInvoiceInput.schema';
import { InvoiceItemCreateWithoutInvoiceInputObjectSchema as InvoiceItemCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemCreateWithoutInvoiceInput.schema';
import { InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema as InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutInvoiceInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput>;
export const InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInputObjectZodSchema = makeSchema();
