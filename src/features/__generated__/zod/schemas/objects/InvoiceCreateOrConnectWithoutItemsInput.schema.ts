import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutItemsInputObjectSchema as InvoiceCreateWithoutItemsInputObjectSchema } from './InvoiceCreateWithoutItemsInput.schema';
import { InvoiceUncheckedCreateWithoutItemsInputObjectSchema as InvoiceUncheckedCreateWithoutItemsInputObjectSchema } from './InvoiceUncheckedCreateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutItemsInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutItemsInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutItemsInput>;
export const InvoiceCreateOrConnectWithoutItemsInputObjectZodSchema = makeSchema();
