import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutProductInputObjectSchema as InvoiceItemUpdateWithoutProductInputObjectSchema } from './InvoiceItemUpdateWithoutProductInput.schema';
import { InvoiceItemUncheckedUpdateWithoutProductInputObjectSchema as InvoiceItemUncheckedUpdateWithoutProductInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutProductInput.schema';
import { InvoiceItemCreateWithoutProductInputObjectSchema as InvoiceItemCreateWithoutProductInputObjectSchema } from './InvoiceItemCreateWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const InvoiceItemUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutProductInput>;
export const InvoiceItemUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();
