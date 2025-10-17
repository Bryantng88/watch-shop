import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema';
import { InvoiceItemUpdateManyMutationInputObjectSchema as InvoiceItemUpdateManyMutationInputObjectSchema } from './InvoiceItemUpdateManyMutationInput.schema';
import { InvoiceItemUncheckedUpdateManyWithoutProductInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutProductInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutProductInput>;
export const InvoiceItemUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();
