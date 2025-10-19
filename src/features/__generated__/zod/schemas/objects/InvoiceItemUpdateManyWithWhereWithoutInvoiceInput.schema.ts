import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema';
import { InvoiceItemUpdateManyMutationInputObjectSchema as InvoiceItemUpdateManyMutationInputObjectSchema } from './InvoiceItemUpdateManyMutationInput.schema';
import { InvoiceItemUncheckedUpdateManyWithoutInvoiceInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutInvoiceInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutInvoiceInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateManyWithWhereWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutInvoiceInput>;
export const InvoiceItemUpdateManyWithWhereWithoutInvoiceInputObjectZodSchema = makeSchema();
