import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutProductInputObjectSchema as InvoiceItemUpdateWithoutProductInputObjectSchema } from './InvoiceItemUpdateWithoutProductInput.schema';
import { InvoiceItemUncheckedUpdateWithoutProductInputObjectSchema as InvoiceItemUncheckedUpdateWithoutProductInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => InvoiceItemUpdateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const InvoiceItemUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateWithWhereUniqueWithoutProductInput>;
export const InvoiceItemUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
