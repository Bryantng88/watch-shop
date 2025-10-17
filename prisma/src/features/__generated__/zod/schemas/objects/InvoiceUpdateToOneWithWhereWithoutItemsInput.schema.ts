import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema';
import { InvoiceUpdateWithoutItemsInputObjectSchema as InvoiceUpdateWithoutItemsInputObjectSchema } from './InvoiceUpdateWithoutItemsInput.schema';
import { InvoiceUncheckedUpdateWithoutItemsInputObjectSchema as InvoiceUncheckedUpdateWithoutItemsInputObjectSchema } from './InvoiceUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutItemsInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutItemsInputObjectSchema)])
}).strict();
export const InvoiceUpdateToOneWithWhereWithoutItemsInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateToOneWithWhereWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateToOneWithWhereWithoutItemsInput>;
export const InvoiceUpdateToOneWithWhereWithoutItemsInputObjectZodSchema = makeSchema();
