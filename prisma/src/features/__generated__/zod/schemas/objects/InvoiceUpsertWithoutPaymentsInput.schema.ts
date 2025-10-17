import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceUpdateWithoutPaymentsInputObjectSchema as InvoiceUpdateWithoutPaymentsInputObjectSchema } from './InvoiceUpdateWithoutPaymentsInput.schema';
import { InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema as InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema } from './InvoiceUncheckedUpdateWithoutPaymentsInput.schema';
import { InvoiceCreateWithoutPaymentsInputObjectSchema as InvoiceCreateWithoutPaymentsInputObjectSchema } from './InvoiceCreateWithoutPaymentsInput.schema';
import { InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema as InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema } from './InvoiceUncheckedCreateWithoutPaymentsInput.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => InvoiceUpdateWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUncheckedUpdateWithoutPaymentsInputObjectSchema)]),
  create: z.union([z.lazy(() => InvoiceCreateWithoutPaymentsInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutPaymentsInputObjectSchema)]),
  where: z.lazy(() => InvoiceWhereInputObjectSchema).optional()
}).strict();
export const InvoiceUpsertWithoutPaymentsInputObjectSchema: z.ZodType<Prisma.InvoiceUpsertWithoutPaymentsInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpsertWithoutPaymentsInput>;
export const InvoiceUpsertWithoutPaymentsInputObjectZodSchema = makeSchema();
