import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema';
import { InvoiceUpdateWithoutPaymentsInputObjectSchema as InvoiceUpdateWithoutPaymentsInputObjectSchema } from './InvoiceUpdateWithoutPaymentsInput.schema';
import { InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema as InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema } from './InvoiceUncheckedUpdateWithoutPaymentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => InvoiceUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema)])
}).strict();
export const InvoiceUpdateToOneWithWhereWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateToOneWithWhereWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateToOneWithWhereWithoutPaymentsInput>;
export const InvoiceUpdateToOneWithWhereWithoutPaymentsInputObjectZodSchema = makeSchema();
