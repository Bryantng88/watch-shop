import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceUpdateWithoutItemsInputObjectSchema as InvoiceUpdateWithoutItemsInputObjectSchema } from './InvoiceUpdateWithoutItemsInput.schema';
import { InvoiceUncheckedUpdateWithoutItemsInputObjectSchema as InvoiceUncheckedUpdateWithoutItemsInputObjectSchema } from './InvoiceUncheckedUpdateWithoutItemsInput.schema';
import { InvoiceCreateWithoutItemsInputObjectSchema as InvoiceCreateWithoutItemsInputObjectSchema } from './InvoiceCreateWithoutItemsInput.schema';
import { InvoiceUncheckedCreateWithoutItemsInputObjectSchema as InvoiceUncheckedCreateWithoutItemsInputObjectSchema } from './InvoiceUncheckedCreateWithoutItemsInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => InvoiceUpdateWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutItemsInputObjectSchema)]),
  where: z.lazy(() => InvoiceWhereInputObjectSchema).optional()
}).strict();
export const InvoiceUpsertWithoutItemsInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithoutItemsInput>;
export const InvoiceUpsertWithoutItemsInputObjectZodSchema = makeSchema();
