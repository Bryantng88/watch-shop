import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema';
import { InvoiceItemUpdateManyMutationInputObjectSchema as InvoiceItemUpdateManyMutationInputObjectSchema } from './InvoiceItemUpdateManyMutationInput.schema';
import { InvoiceItemUncheckedUpdateManyWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutProductVariantInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutProductVariantInput>;
export const InvoiceItemUpdateManyWithWhereWithoutProductVariantInputObjectZodSchema = makeSchema();
