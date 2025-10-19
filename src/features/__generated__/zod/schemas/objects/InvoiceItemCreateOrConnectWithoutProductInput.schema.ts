import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemCreateWithoutProductInputObjectSchema as InvoiceItemCreateWithoutProductInputObjectSchema } from './InvoiceItemCreateWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const InvoiceItemCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateOrConnectWithoutProductInput>;
export const InvoiceItemCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();
