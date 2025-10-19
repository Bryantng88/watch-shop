import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema';
import { InvoiceItemUpdateManyMutationInputObjectSchema as InvoiceItemUpdateManyMutationInputObjectSchema } from './InvoiceItemUpdateManyMutationInput.schema';
import { InvoiceItemUncheckedUpdateManyWithoutVariantInputObjectSchema as InvoiceItemUncheckedUpdateManyWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedUpdateManyWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateManyMutationInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateManyWithoutVariantInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateManyWithWhereWithoutVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyWithWhereWithoutVariantInput>;
export const InvoiceItemUpdateManyWithWhereWithoutVariantInputObjectZodSchema = makeSchema();
