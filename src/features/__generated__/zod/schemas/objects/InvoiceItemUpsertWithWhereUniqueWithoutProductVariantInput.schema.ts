import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutProductVariantInputObjectSchema as InvoiceItemUpdateWithoutProductVariantInputObjectSchema } from './InvoiceItemUpdateWithoutProductVariantInput.schema';
import { InvoiceItemUncheckedUpdateWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedUpdateWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutProductVariantInput.schema';
import { InvoiceItemCreateWithoutProductVariantInputObjectSchema as InvoiceItemCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemCreateWithoutProductVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutProductVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInput>;
export const InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInputObjectZodSchema = makeSchema();
