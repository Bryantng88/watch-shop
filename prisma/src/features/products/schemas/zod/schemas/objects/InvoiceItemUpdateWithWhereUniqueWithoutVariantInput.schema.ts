import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutVariantInputObjectSchema as InvoiceItemUpdateWithoutVariantInputObjectSchema } from './InvoiceItemUpdateWithoutVariantInput.schema';
import { InvoiceItemUncheckedUpdateWithoutVariantInputObjectSchema as InvoiceItemUncheckedUpdateWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutVariantInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutVariantInput>;
export const InvoiceItemUpdateWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
