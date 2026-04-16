import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemCreateWithoutProductVariantInputObjectSchema as InvoiceItemCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemCreateWithoutProductVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema)])
}).strict();
export const InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutProductVariantInput>;
export const InvoiceItemCreateOrConnectWithoutProductVariantInputObjectZodSchema = makeSchema();
