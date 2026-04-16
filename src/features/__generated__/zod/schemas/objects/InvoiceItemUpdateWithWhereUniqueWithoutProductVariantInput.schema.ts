import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutProductVariantInputObjectSchema as InvoiceItemUpdateWithoutProductVariantInputObjectSchema } from './InvoiceItemUpdateWithoutProductVariantInput.schema';
import { InvoiceItemUncheckedUpdateWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedUpdateWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutProductVariantInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInput>;
export const InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
