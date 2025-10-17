import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemCreateWithoutVariantInputObjectSchema as InvoiceItemCreateWithoutVariantInputObjectSchema } from './InvoiceItemCreateWithoutVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutVariantInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema)])
}).strict();
export const InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutVariantInput>;
export const InvoiceItemCreateOrConnectWithoutVariantInputObjectZodSchema = makeSchema();
