import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithoutVariantInputObjectSchema as InvoiceItemUpdateWithoutVariantInputObjectSchema } from './InvoiceItemUpdateWithoutVariantInput.schema';
import { InvoiceItemUncheckedUpdateWithoutVariantInputObjectSchema as InvoiceItemUncheckedUpdateWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedUpdateWithoutVariantInput.schema';
import { InvoiceItemCreateWithoutVariantInputObjectSchema as InvoiceItemCreateWithoutVariantInputObjectSchema } from './InvoiceItemCreateWithoutVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedUpdateWithoutVariantInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const InvoiceItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpsertWithWhereUniqueWithoutVariantInput>;
export const InvoiceItemUpsertWithWhereUniqueWithoutVariantInputObjectZodSchema = makeSchema();
